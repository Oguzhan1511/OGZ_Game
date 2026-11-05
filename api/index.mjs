import { handleVercelRequest } from '../server/vercel-app.mjs';
export default async function handler(req, res) {
  try {
    const origin = 'https://' + req.headers.host;
    const incoming = new URL(req.url, origin);
    const route = incoming.searchParams.get('__route');
    incoming.searchParams.delete('__route');
    if (route !== null) incoming.pathname = '/' + route.replace(/^\//, '');
    const chunks = [];
    if (!['GET', 'HEAD'].includes(req.method)) {
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 4400000) {
          res.writeHead(413, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ error: 'Görsellerin toplamı en fazla 4 MB olabilir.' }));
          return;
        }
        chunks.push(chunk);
      }
    }
    const request = new Request(incoming, {
      method: req.method,
      headers: req.headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
    });
    const response = await handleVercelRequest(request, process.env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error('Request failed', error.message);
    res.writeHead(503, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ error: 'Sunucuya erişilemiyor. Lütfen tekrar dene.' }));
  }
}
