export function hasSupabase(env) {
  return !!(env.OGZ_SUPABASE_URL && env.OGZ_SUPABASE_KEY);
}
export async function supabaseListings(env, items, action = 'insert') {
  const response = await fetch(env.OGZ_SUPABASE_URL, {
    method: items ? 'POST' : 'GET',
    headers: { 'x-ogz-key': env.OGZ_SUPABASE_KEY, 'content-type': 'application/json' },
    body: items ? JSON.stringify({ listings: items, action }) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw Error('Supabase ilan servisine erişilemiyor. Lütfen tekrar dene.');
  return response.json();
}
export async function gameListings(env) {
  if (env.OGZ_DIRECT_RPC_HEADERS) {
    const items = [];
    for (let offset = 0; ; offset += 1000) {
      const r = await fetch(
        env.OGZ_DIRECT_URL +
          '/rest/v1/ogz_game_listings?select=*&order=created_at.desc,id.asc&limit=1000&offset=' +
          offset,
        { headers: env.OGZ_DIRECT_RPC_HEADERS }
      );
      if (!r.ok) throw Error('İlan havuzuna erişilemiyor.');
      const rows = await r.json();
      items.push(
        ...rows.map(r => ({
          id: r.id,
          mode: r.mode,
          car: r.car,
          createdAt: r.created_at,
          archived: r.archived,
        }))
      );
      if (rows.length < 1000) return items;
    }
  }
  const old = await env.DB.prepare(
    'SELECT data FROM admin_listings ORDER BY created_at DESC'
  ).all();
  const local = old.results.map(row => JSON.parse(row.data));
  if (!hasSupabase(env)) return local;
  const remote = await supabaseListings(env);
  return [...new Map([...local, ...remote.listings].map(item => [item.id, item])).values()].sort(
    (a, b) => b.createdAt - a.createdAt
  );
}
export async function syncSupabase(request, env) {
  if (request.method !== 'POST') return new Response(null, { status: 405 });
  if (!hasSupabase(env) || request.headers.get('x-ogz-key') !== env.OGZ_SUPABASE_KEY)
    return new Response(null, { status: 403 });
  const old = await env.DB.prepare(
    'SELECT data FROM admin_listings ORDER BY created_at DESC'
  ).all();
  const items = old.results.map(row => JSON.parse(row.data));
  if (items.length) await supabaseListings(env, items);
  return new Response(JSON.stringify({ synced: items.length }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export async function supabaseMedia(env, path, bytes) {
  const url = env.OGZ_SUPABASE_URL.replace(/ogz-game-listings\/?$/, 'ogz-game-products');
  const response = await fetch(url + '?image=' + encodeURIComponent(path.replace(/^\//, '')), {
    method: 'PUT',
    headers: { 'x-ogz-key': env.OGZ_SUPABASE_KEY },
    body: bytes,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw Error('Supabase görsel servisine erişilemiyor. Lütfen tekrar dene.');
  return (await response.json()).image;
}
