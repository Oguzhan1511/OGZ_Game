import assert from 'node:assert/strict';
import { adminApi } from '../worker/admin.js';
import { createDB } from './test-db.mjs';
const env = {
  DB: createDB(),
  BUCKET: {
    put() {
      throw Error('R2 must not receive Supabase uploads');
    },
  },
  OGZ_SUPABASE_URL: 'https://example.test/functions/v1/ogz-game-listings',
  OGZ_SUPABASE_KEY: 'server-secret',
};
const original = globalThis.fetch,
  uploads = [];
let saved;
try {
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers['x-ogz-key'], 'server-secret');
    if (options.method === 'PUT') {
      assert.ok(url.startsWith('https://example.test/functions/v1/ogz-game-products?image=media'));
      assert.ok(options.body instanceof Uint8Array);
      const image = 'https://storage.test/' + uploads.length;
      uploads.push(image);
      return Response.json({ image });
    }
    assert.equal(options.method, 'POST');
    saved = JSON.parse(options.body).listings[0];
    return Response.json({ saved: 1 });
  };
  const form = new FormData();
  for (const [k, v] of Object.entries({
    mode: 'car-price',
    brand: 'Test',
    model: 'Model',
    family: 'Model',
    year: '2025',
    km: '20.000',
    price: '1.500.000',
    fuel: 'Benzin',
    gear: 'Manuel',
  }))
    form.set(k, v);
  for (const key of ['photo', 'diagram'])
    form.set(
      key,
      new File([new Uint8Array([255, 216, 255, ...Array(20).fill(0)])], 'image.jpg', {
        type: 'image/jpeg',
      })
    );
  const response = await adminApi(
    new Request('https://game.test/api/admin/listings', {
      method: 'POST',
      headers: {
        origin: 'https://game.test',
        'oai-authenticated-user-email': 'selenetarotspell@gmail.com',
      },
      body: form,
    }),
    env
  );
  assert.equal(response.status, 201);
  assert.equal(uploads.length, 2);
  assert.equal(saved.car[10], uploads[0]);
  assert.equal(saved.car[11].damageImage, uploads[1]);
  assert.equal((await response.json()).listing.car[10], uploads[0]);
} finally {
  globalThis.fetch = original;
}
console.log(
  'PASS: car photo and damage uploads go to Supabase and persisted listings use their returned URLs.'
);
