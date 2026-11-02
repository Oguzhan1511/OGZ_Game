import { json } from './room-service.js';

export async function serveMedia(request, env, path, mediaManifest) {
  if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'Geçersiz yöntem' }, 405);
  const meta = mediaManifest[path];
  if (!meta || !env.BUCKET) return json({ error: 'Görsel bulunamadı' }, 404);
  const object = await env.BUCKET.get(path.slice(1));
  if (!object) return json({ error: 'Görsel bulunamadı' }, 404);
  const headers = { 'content-type': meta.type, 'content-length': String(meta.size), 'cache-control': 'public, max-age=31536000, immutable', etag: '"' + meta.sha256 + '"' };
  if (request.headers.get('if-none-match') === headers.etag) return new Response(null, { status: 304, headers });
  return new Response(request.method === 'HEAD' ? null : object.body, { headers });
}

export async function uploadMedia(request, env, path, mediaManifest) {
  if (request.method !== 'PUT') return json({ error: 'Geçersiz yöntem' }, 405);
  if (!env.ASSET_UPLOAD_KEY || request.headers.get('authorization') !== 'Bearer ' + env.ASSET_UPLOAD_KEY) return json({ error: 'Yetkisiz yükleme' }, 403);
  const key = path.replace('/api/media/', '/media/'), meta = mediaManifest[key];
  if (!meta || !env.BUCKET) return json({ error: 'Bilinmeyen görsel anahtarı' }, 400);
  if (Number(request.headers.get('content-length') || meta.size) > meta.size) return json({ error: 'Görsel boyutu sınırı aşıldı' }, 400);
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength !== meta.size) return json({ error: 'Görsel boyutu uyuşmuyor' }, 400);
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
  if (hash !== meta.sha256) return json({ error: 'Görsel doğrulanamadı' }, 400);
  await env.BUCKET.put(key.slice(1), bytes, { httpMetadata: { contentType: meta.type }, customMetadata: { sha256: meta.sha256 } });
  return json({ ok: true });
}
