import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.js';
const root = path.resolve('.local');
fs.mkdirSync(root, { recursive: true });
const sqlite = new DatabaseSync(path.join(root, 'game.sqlite'));
sqlite.exec('CREATE TABLE IF NOT EXISTS local_migrations(name TEXT PRIMARY KEY)');
for (const file of fs
  .readdirSync('drizzle')
  .filter(f => f.endsWith('.sql'))
  .sort()) {
  if (sqlite.prepare('SELECT name FROM local_migrations WHERE name=?').get(file)) continue;
  sqlite.exec('BEGIN');
  try {
    sqlite.exec(fs.readFileSync('drizzle/' + file, 'utf8'));
    sqlite.prepare('INSERT INTO local_migrations VALUES(?)').run(file);
    sqlite.exec('COMMIT');
  } catch (e) {
    sqlite.exec('ROLLBACK');
    throw e;
  }
}
const DB = {
  prepare(sql) {
    let args = [];
    return {
      bind(...a) {
        args = a;
        return this;
      },
      async first() {
        return sqlite.prepare(sql).get(...args) || null;
      },
      async all() {
        return { results: sqlite.prepare(sql).all(...args) };
      },
      sync() {
        const r = sqlite.prepare(sql).run(...args);
        return { meta: { changes: Number(r.changes) } };
      },
      async run() {
        return this.sync();
      },
    };
  },
  async batch(statements) {
    sqlite.exec('BEGIN');
    try {
      const values = statements.map(s => s.sync());
      sqlite.exec('COMMIT');
      return values;
    } catch (e) {
      sqlite.exec('ROLLBACK');
      throw e;
    }
  },
};
async function start(config = {}) {
  if (!config.listings && fs.existsSync(path.join(root, 'listings.json')))
    config.listings = JSON.parse(fs.readFileSync(path.join(root, 'listings.json'), 'utf8'));
  if (config.listings) {
    for (const item of config.listings)
      sqlite
        .prepare('INSERT OR IGNORE INTO admin_listings(id,data,created_at) VALUES(?,?,?)')
        .run(item.id, JSON.stringify(item), item.createdAt);
  }
  if (!config.products && fs.existsSync(path.join(root, 'products.json')))
    config.products = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8'));
  if (config.products) {
    for (const item of config.products)
      sqlite
        .prepare('INSERT OR IGNORE INTO products(id,data,created_at) VALUES(?,?,?)')
        .run(item.id, JSON.stringify(item), item.createdAt);
  }
  if (
    sqlite.prepare('SELECT count(*) n FROM products').get().n === 0 &&
    fs.existsSync('scripts/seed-products.mjs')
  ) {
    await import('./seed-products.mjs');
  }
  const BUCKET = {
    async put(key, bytes, meta) {
      const file = path.join(root, 'media', key);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(bytes));
      fs.writeFileSync(file + '.meta', JSON.stringify(meta.httpMetadata));
    },
    async get(key) {
      let file = path.join(root, 'media', key);
      if (fs.existsSync(file))
        return {
          body: fs.readFileSync(file),
          httpMetadata: JSON.parse(fs.readFileSync(file + '.meta', 'utf8')),
        };
      const original = path.join('assets/listings', key.replace(/^media\//, ''));
      if (fs.existsSync(original))
        return {
          body: fs.readFileSync(original),
          httpMetadata: { contentType: original.endsWith('.png') ? 'image/png' : 'image/jpeg' },
        };
      if (config.siteToken) {
        const res = await fetch(config.site + '/media/' + key.replace(/^media\//, ''), {
          headers: { 'OAI-Sites-Authorization': 'Bearer ' + config.siteToken },
          signal: AbortSignal.timeout(15000),
        });
        if (res.ok) {
          const bytes = await res.arrayBuffer(),
            meta = { contentType: res.headers.get('content-type') };
          await this.put(key, bytes, { httpMetadata: meta });
          return { body: bytes, httpMetadata: meta };
        }
      }
      return null;
    },
    async delete(key) {
      fs.rmSync(path.join(root, 'media', key), { force: true });
      fs.rmSync(path.join(root, 'media', key) + '.meta', { force: true });
    },
  };
  const AUCTION_STORE = {
    catalog: fs.existsSync(path.join(root, 'auction-catalog.json'))
      ? JSON.parse(fs.readFileSync(path.join(root, 'auction-catalog.json'), 'utf8'))
      : null,
  };
  const saveAuctionCatalog = async catalog =>
    fs.writeFileSync(path.join(root, 'auction-catalog.json'), JSON.stringify(catalog));
  const server = http.createServer(async (req, res) => {
    try {
      const chunks = [];
      for await (const c of req) {
        chunks.push(c);
        if (chunks.reduce((n, c) => n + c.length, 0) > 12000000) {
          res.writeHead(413);
          res.end();
          return;
        }
      }
      const headers = {
        ...req.headers,
        'oai-authenticated-user-email': 'selenetarotspell@gmail.com',
      };
      const result = await worker.fetch(
        new Request('http://localhost:4317' + req.url, {
          method: req.method,
          headers,
          body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
        }),
        { DB, BUCKET, AUCTION_STORE, saveAuctionCatalog }
      );
      res.writeHead(result.status, Object.fromEntries(result.headers));
      res.end(Buffer.from(await result.arrayBuffer()));
    } catch (e) {
      console.error(e.message);
      res.writeHead(500);
      res.end('Local request failed');
    }
  });
  const adminListingCount = sqlite.prepare('SELECT count(*) n FROM admin_listings').get().n;
  const productCount = sqlite.prepare('SELECT count(*) n FROM products').get().n;
  server.listen(4317, '127.0.0.1', () =>
    console.log(
      'Local: http://localhost:4317\nAdmin: http://localhost:4317/admin\nLocal custom cars: ' +
        adminListingCount +
        '\nLocal products: ' +
        productCount
    )
  );
}
if (process.argv.includes('--connected')) {
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdout.write('Ready for local snapshot JSON on stdin (hidden).\n');
  let data = '';
  process.stdin.on('data', chunk => {
    data += chunk.toString();
    if (data.includes('\n')) {
      process.stdin.pause();
      start(JSON.parse(data.trim())).catch(e => {
        console.error(e.message);
        process.exit(1);
      });
    }
  });
} else start();
