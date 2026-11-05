import assert from 'node:assert/strict';
import { gameDatabase, databaseMigration } from '../worker/game-db.js';
const original = globalThis.fetch,
  packets = [];
const env = {
  OGZ_SUPABASE_URL: 'https://db.test/functions/v1/ogz-game-listings',
  OGZ_SUPABASE_KEY: 'secret',
};
try {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://db.test/functions/v1/ogz-game-database');
    assert.equal(options.headers['x-ogz-key'], 'secret');
    const { operations } = JSON.parse(options.body);
    packets.push(operations);
    return Response.json({
      results: operations.map(o => ({
        results: o.op === 'room_get' ? [{ data: '{}', version: 7 }] : [],
        meta: { changes: 1 },
      })),
    });
  };
  const db = gameDatabase(env);
  assert.equal(
    (await db.prepare('SELECT data,version FROM rooms WHERE code=?').bind('ABCDEF').first())
      .version,
    7
  );
  const reserve = db
    .prepare(
      "INSERT INTO listing_reservations(token,listing_id,room_code,expires_at) SELECT ?,json_extract(value,'$.id'),?,? FROM json_each(?) WHERE EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?)"
    )
    .bind('token', 'ABCDEF', 123, '[]', 'ABCDEF', 7);
  const update = db
    .prepare('UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?')
    .bind('{}', 'ABCDEF', 7);
  assert.equal((await db.batch([reserve, update])).length, 2);
  assert.deepEqual(
    packets.at(-1).map(p => p.op),
    ['reserve', 'room_save']
  );
  assert.throws(() => db.prepare('DROP TABLE rooms'), /Unsupported/);
  await db
    .prepare('SELECT listing_id FROM listing_reservations WHERE token IN (?,?)')
    .bind('a', 'b')
    .all();
  assert.equal(packets.at(-1)[0].op, 'reservations_get');
  assert.equal(
    (
      await databaseMigration(new Request('https://site.test/api/database-migration?table=rooms'), {
        OGZ_GAME_DB: 'supabase',
      })
    ).status,
    403
  );
  globalThis.fetch = async () => new Response(null, { status: 503 });
  await assert.rejects(
    () => db.prepare('SELECT data,version FROM rooms WHERE code=?').bind('ABCDEF').first(),
    /veritabanına/
  );
} finally {
  globalThis.fetch = original;
}
console.log(
  'PASS: static Supabase operation mapping, one-RPC batches, unknown SQL rejection, migration endpoint disabled after cutover, fail-closed database errors.'
);
