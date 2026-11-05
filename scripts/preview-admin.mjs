import http from 'node:http';
import worker from '../worker/index.js';
import { createDB } from './test-db.mjs';
const DB = createDB(),
  objects = new Map(),
  BUCKET = {
    async put(k, body, meta) {
      objects.set(k, { body, httpMetadata: meta.httpMetadata });
    },
    async get(k) {
      return objects.get(k);
    },
    async delete(k) {
      objects.delete(k);
    },
  };
http
  .createServer(async (req, res) => {
    try {
      const chunks = [];
      for await (const c of req) chunks.push(c);
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
        { DB, BUCKET }
      );
      res.writeHead(result.status, Object.fromEntries(result.headers));
      res.end(Buffer.from(await result.arrayBuffer()));
    } catch (e) {
      res.writeHead(500);
      res.end(e.message);
    }
  })
  .listen(4317, '127.0.0.1', () => console.log('Local: http://localhost:4317/admin'));
