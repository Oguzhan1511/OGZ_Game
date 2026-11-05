export function gameDatabase(env) {
  const direct = env.OGZ_DIRECT_RPC_HEADERS;
  const endpoint = direct
    ? env.OGZ_DIRECT_URL + '/rest/v1/rpc/ogz_game_state'
    : env.OGZ_SUPABASE_URL.replace(/ogz-game-listings\/?$/, 'ogz-game-database');
  const classify = sql => {
    if (sql === 'INSERT OR IGNORE INTO rooms(code,data,created_at) VALUES(?,?,?)')
      return 'room_create';
    if (sql === 'SELECT data,version FROM rooms WHERE code=?') return 'room_get';
    if (sql === 'UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?')
      return 'room_save';
    if (sql === 'SELECT data FROM admin_listings ORDER BY created_at DESC')
      return 'legacy_listings';
    if (
      /^SELECT listing_id,SUM\(seen_count\) AS seen_count,MAX\(seen_at\) AS last_seen FROM listing_history WHERE token IN \(\?(,\?)*\) GROUP BY listing_id$/.test(
        sql
      )
    )
      return 'history_get';
    if (/^SELECT listing_id FROM listing_reservations WHERE token IN \(\?(,\?)*\)$/.test(sql))
      return 'reservations_get';
    if (sql === 'DELETE FROM listing_reservations WHERE expires_at<=?')
      return 'reservations_expire';
    if (
      sql.startsWith(
        'INSERT INTO listing_reservations(token,listing_id,room_code,expires_at) SELECT '
      )
    )
      return 'reserve';
    if (
      sql.startsWith(
        'INSERT INTO listing_history(token,listing_id,room_code,round_number,seen_at,seen_count) SELECT '
      )
    )
      return 'history_mark';
    if (
      sql ===
      'DELETE FROM listing_reservations WHERE room_code=? AND EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?)'
    )
      return 'release_room';
    if (
      sql ===
      'DELETE FROM listing_reservations WHERE room_code=? AND token=? AND EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?)'
    )
      return 'release_player';
    if (sql === 'DELETE FROM admin_login_attempts WHERE key=?') return 'login_reset';
    if (
      sql.startsWith(
        'INSERT INTO admin_login_attempts(key,attempts,window_start) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE '
      )
    )
      return 'login_attempt';
    if (sql === 'SELECT attempts FROM admin_login_attempts WHERE key=?') return 'login_get';
    throw Error('Unsupported game database operation');
  };
  const reads = new Map();
  const execute = async operations => {
    if (operations.every(o => o.op === 'legacy_listings'))
      return operations.map(() => ({ results: [], meta: { changes: 0 } }));
    if (
      operations.some(
        o =>
          !['room_get', 'history_get', 'reservations_get', 'login_get', 'legacy_listings'].includes(
            o.op
          )
      )
    )
      reads.clear();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: direct || { 'x-ogz-key': env.OGZ_SUPABASE_KEY, 'content-type': 'application/json' },
      body: JSON.stringify(direct ? { operations } : { operations }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      if (response.status === 409 && body.code === '23505')
        throw Error('UNIQUE constraint: reservation');
      throw Error('Oyun veritabanına erişilemiyor. Tekrar dene.');
    }
    const data = await response.json();
    return direct ? data : data.results;
  };
  return {
    remote: true,
    prepare(sql) {
      const packet = { op: classify(sql), params: [] };
      return {
        packet,
        bind(...params) {
          packet.params = params;
          return this;
        },
        async first() {
          const key = JSON.stringify(packet);
          if (packet.op === 'room_get') {
            if (!reads.has(key))
              reads.set(
                key,
                execute([packet]).catch(e => {
                  reads.delete(key);
                  throw e;
                })
              );
            return (await reads.get(key))[0].results[0] || null;
          }
          return (await execute([packet]))[0].results[0] || null;
        },
        async all() {
          return (await execute([packet]))[0];
        },
        async run() {
          return (await execute([packet]))[0];
        },
      };
    },
    async batch(statements) {
      return execute(statements.map(s => s.packet));
    },
  };
}
export async function databaseMigration(request, env) {
  if (
    !env.OGZ_MIGRATION_KEY ||
    request.headers.get('x-ogz-migration-key') !== env.OGZ_MIGRATION_KEY ||
    env.OGZ_GAME_DB === 'supabase'
  )
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  const url = new URL(request.url),
    table = url.searchParams.get('table'),
    offset = Number(url.searchParams.get('offset') || 0),
    tables = {
      rooms: 'code',
      listing_history: 'token,listing_id',
      listing_reservations: 'token,listing_id',
      admin_login_attempts: 'key',
    };
  if (
    request.method !== 'GET' ||
    !Object.hasOwn(tables, table) ||
    !Number.isSafeInteger(offset) ||
    offset < 0
  )
    return Response.json({ error: 'Invalid export' }, { status: 400 });
  const limit = table === 'rooms' ? 10 : 500,
    rows = await env.DB.prepare(
      'SELECT * FROM ' + table + ' ORDER BY ' + tables[table] + ' LIMIT ? OFFSET ?'
    )
      .bind(limit, offset)
      .all();
  return Response.json(
    { table, rows: rows.results, limit },
    { headers: { 'cache-control': 'no-store' } }
  );
}
