import { supabaseListings } from './supabase.js';
export async function deploymentRequest(request, env) {
  const fail = (error, status) =>
    new Response(JSON.stringify({ error }), {
      status,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  if (
    !env.OGZ_DEPLOYMENT_KEY ||
    request.headers.get('x-ogz-deployment-key') !== env.OGZ_DEPLOYMENT_KEY
  )
    return fail('Unauthorized', 403);
  const url = new URL(request.url);
  if (url.pathname === '/api/deployment-import') {
    if (request.method === 'PUT') {
      const key = url.searchParams.get('key');
      if (!/^media\/admin\/admin-[a-f0-9-]{36}-[01]$/.test(key || ''))
        return fail('Invalid media key', 400);
      const bytes = new Uint8Array(await request.arrayBuffer());
      if (bytes.length < 12 || bytes.length > 5000000) return fail('Invalid media size', 400);
      const type =
        bytes[0] === 255 && bytes[1] === 216
          ? 'image/jpeg'
          : bytes[0] === 137 && bytes[1] === 80
            ? 'image/png'
            : String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
              ? 'image/webp'
              : null;
      if (!type) return fail('Invalid image', 400);
      await env.BUCKET.put(key, bytes, { httpMetadata: { contentType: type } });
      return fail('saved', 200);
    }
    if (request.method !== 'POST') return fail('Method not allowed', 405);
    const { listings } = await request.json();
    if (
      !Array.isArray(listings) ||
      listings.length > 1000 ||
      listings.some(
        item =>
          typeof item.id !== 'string' || item.car?.length !== 12 || item.car[11]?.id !== item.id
      )
    )
      return fail('Invalid listings', 400);
    await supabaseListings(env, listings, 'import');
    return new Response(JSON.stringify({ imported: listings.length }), {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
  if (url.pathname === '/api/deployment-login') {
    if (request.method !== 'POST') return fail('Method not allowed', 405);
    const { key, action } = await request.json();
    if (!/^[a-f0-9]{64}$/.test(key || '')) return fail('Invalid key', 400);
    if (action === 'reset') {
      await env.DB.prepare('DELETE FROM admin_login_attempts WHERE key=?').bind(key).run();
      return fail('reset', 200);
    }
    if (action !== 'attempt') return fail('Invalid action', 400);
    const now = Date.now(),
      window = 900000;
    await env.DB.prepare(
      'INSERT INTO admin_login_attempts(key,attempts,window_start) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN window_start<=? THEN 1 ELSE attempts+1 END,window_start=CASE WHEN window_start<=? THEN excluded.window_start ELSE window_start END'
    )
      .bind(key, now, now - window, now - window)
      .run();
    const row = await env.DB.prepare('SELECT attempts FROM admin_login_attempts WHERE key=?')
      .bind(key)
      .first();
    return new Response(JSON.stringify({ allowed: row.attempts <= 5 }), {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
  const target = request.headers.get('x-ogz-path'),
    origin = request.headers.get('x-ogz-origin');
  if (!target?.startsWith('/') || target.startsWith('//')) return fail('Invalid path', 400);
  let forwarded;
  try {
    forwarded = new URL(target, origin);
    if (
      forwarded.origin !== new URL(origin).origin ||
      !['http:', 'https:'].includes(forwarded.protocol)
    )
      return fail('Invalid origin', 400);
  } catch {
    return fail('Invalid origin', 400);
  }
  const path = forwarded.pathname;
  if (
    ![
      '/',
      '/logo.png',
      '/mascot.jpg',
      '/admin',
      '/admin/ocr-engine.js',
      '/api/room',
      '/api/admin/listings',
    ].includes(path) &&
    !path.startsWith('/media/')
  )
    return fail('Not found', 404);
  const headers = new Headers(request.headers);
  headers.delete('oai-authenticated-user-id');
  headers.delete('oai-authenticated-user-email');
  headers.delete('x-ogz-deployment-key');
  headers.delete('x-ogz-path');
  headers.delete('x-ogz-origin');
  if (request.headers.get('x-ogz-admin') === '1')
    headers.set('oai-authenticated-user-email', 'selenetarotspell@gmail.com');
  headers.delete('x-ogz-admin');
  return new Request(forwarded, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    duplex: 'half',
  });
}
