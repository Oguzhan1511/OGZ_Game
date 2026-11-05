import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdout.write('Ready for deployment migration JSON on stdin (hidden).\n');
let input = '';
for await (const chunk of process.stdin) {
  input += chunk;
  if (input.includes('\n')) break;
}
if (process.stdin.isTTY) process.stdin.setRawMode(false);
const config = JSON.parse(input.trim());
const db = new DatabaseSync('.local/game.sqlite', { readOnly: true });
const listings = db
  .prepare('SELECT data FROM admin_listings ORDER BY created_at')
  .all()
  .map(row => JSON.parse(row.data));
const headers = {
  'OAI-Sites-Authorization': 'Bearer ' + config.token,
  'x-ogz-deployment-key': config.key,
};
const inventory = await fetch(config.origin + '/api/vercel-bridge', {
  headers: {
    ...headers,
    'x-ogz-admin': '1',
    'x-ogz-origin': 'https://migration.local',
    'x-ogz-path': '/api/admin/listings',
  },
});
if (!inventory.ok) throw Error('Inventory HTTP ' + inventory.status);
const old = (await inventory.json()).listings;
const known = new Map(old.map(item => [item.id, item]));
const media = new Set();
for (const item of listings) {
  const previous = known.get(item.id);
  for (const target of [item.car[10], item.car[11].damageImage])
    if (
      target?.startsWith('/media/admin/') &&
      (!previous || ![previous.car[10], previous.car[11].damageImage].includes(target))
    )
      media.add(target.slice(1));
}
let uploaded = 0;
const queue = [...media];
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (queue.length) {
      const key = queue.shift(),
        file = path.join('.local/media', key);
      if (!fs.existsSync(file)) throw Error('Missing local media: ' + key);
      const bytes = fs.readFileSync(file);
      let good = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        const response = await fetch(
          config.origin + '/api/deployment-import?key=' + encodeURIComponent(key),
          { method: 'PUT', headers, body: bytes, signal: AbortSignal.timeout(30000) }
        );
        if (response.ok) {
          good = true;
          break;
        }
        if (attempt === 2) throw Error('Media upload HTTP ' + response.status);
      }
      if (good) {
        uploaded++;
        if (uploaded % 20 === 0) console.log('Media ' + uploaded + '/' + media.size);
      }
    }
  })
);
for (let i = 0; i < listings.length; i += 50) {
  const response = await fetch(config.origin + '/api/deployment-import', {
    method: 'POST',
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify({ listings: listings.slice(i, i + 50) }),
    signal: AbortSignal.timeout(55000),
  });
  if (!response.ok) throw Error('Listing import HTTP ' + response.status);
}
const check = await fetch(config.origin + '/api/vercel-bridge', {
  headers: {
    ...headers,
    'x-ogz-admin': '1',
    'x-ogz-origin': 'https://migration.local',
    'x-ogz-path': '/api/admin/listings',
  },
});
const after = (await check.json()).listings;
const ids = new Set(after.map(item => item.id));
if (listings.some(item => !ids.has(item.id))) throw Error('Listing count mismatch');
console.log(
  JSON.stringify({
    localListings: listings.length,
    liveListings: after.length,
    active: after.filter(item => !item.archived).length,
    mediaUploaded: uploaded,
    verified: true,
  })
);
process.exit(0);
