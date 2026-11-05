import assert from 'node:assert/strict';
import { productListings, productService } from '../worker/products.js';
const env = {
  OGZ_SUPABASE_URL: 'https://example.test/functions/v1/ogz-game-listings',
  OGZ_SUPABASE_KEY: 'server-secret',
};
const original = globalThis.fetch;
const product = { id: 'product-test', name: 'Süt', category: 'market', price: 49.9 };
try {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://example.test/functions/v1/ogz-game-products');
    assert.equal(options.headers['x-ogz-key'], 'server-secret');
    assert.equal(options.method, 'GET');
    return Response.json({ products: [product] });
  };
  assert.deepEqual(await productListings(env), [product]);
  globalThis.fetch = async (url, options) => {
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), { products: [product] });
    return Response.json({ saved: 1 });
  };
  assert.equal((await productService(env, { method: 'POST', products: [product] })).saved, 1);
  globalThis.fetch = async () => new Response(null, { status: 503 });
  await assert.rejects(() => productListings(env), /Supabase/);
} finally {
  globalThis.fetch = original;
}
console.log(
  'PASS: products use the authenticated Supabase service and fail closed on storage errors.'
);
