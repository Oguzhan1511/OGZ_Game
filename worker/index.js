import { modeCardStyles, modeCardClient } from "./ui/mode-cards.js";
import { productCategories, normalizeProductCategories, productListings, productAsRound, productAdminApi } from "./modes/product/products.js";
import { productAdminHtml, productGameStyles, productGameClient } from "./modes/product/product-ui.js";
import { desktopGameStyles } from "./ui/desktop-game.js";
import { roundRankingStyles, roundRankingClient } from "./ui/round-ranking.js";
import { mobileGameStyles, mobileGameClient } from "./ui/mobile-game.js";
import { guessInputClient } from "./ui/guess-input.js";
import { deploymentRequest } from "./services/deployment.js";
import { tesseractScript } from "./ocr/ocr-engine.js";
import { gameListings, syncSupabase } from "./services/supabase.js";
import { logoPng } from "./ui/assets.js";
import { adminApi, adminMedia, adminHtml } from "./services/admin.js";
import { selectListings } from "./selection.js";
import { cars as baseCars } from "./modes/car/catalog.js";
import { mediaManifest } from "./modes/car/media-manifest.js";
import { createGameModes } from "./game-modes.js";
import { createRoomService, validProfile, json } from "./services/room-service.js";
import { serveMedia, uploadMedia } from "./services/media.js";
import { createAppShell } from "./ui/app-shell.js";

const cars = baseCars;
const gameModes = createGameModes({
  adminHtml,
  adminApi,
  gameListings,
  productCategories,
  normalizeProductCategories,
  productListings,
  productAsRound,
  productAdminHtml,
  productAdminApi
});

const roomApi = createRoomService({ gameModes, cars, selectListings });
const html = createAppShell({
  desktopGameStyles,
  roundRankingStyles,
  mobileGameStyles,
  guessInputClient,
  productGameStyles,
  productGameClient,
  modeCardStyles,
  modeCardClient,
  roundRankingClient,
  mobileGameClient,
  validProfile
});

export default {
  async fetch(request, env) {
    try {
      let u = new URL(request.url);
      if (['/api/vercel-bridge', '/api/deployment-import', '/api/deployment-login'].includes(u.pathname)) {
        const forwarded = await deploymentRequest(request, env);
        if (forwarded instanceof Response) return forwarded;
        request = forwarded;
        u = new URL(request.url);
      }
      if (u.pathname === '/api/admin/supabase-sync') return await syncSupabase(request, env);
      if (u.pathname === '/admin/ocr-engine.js') {
        return new Response(tesseractScript, {
          headers: {
            'content-type': 'application/javascript; charset=utf-8',
            'cache-control': 'public,max-age=86400',
            'x-content-type-options': 'nosniff'
          }
        });
      }
      const adminMode = gameModes.get(u.searchParams.get('mode')) || gameModes.get('car-price');
      if (u.pathname === '/admin') {
        return new Response(adminMode.adminHtml, {
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'no-store'
          }
        });
      }
      if (u.pathname === '/api/admin/listings') return await adminMode.adminApi(request, env);
      if (u.pathname.startsWith('/media/admin/')) return await adminMedia(request, env, u.pathname);
      if (u.pathname.startsWith('/media/')) return await serveMedia(request, env, u.pathname, mediaManifest);
      if (u.pathname.startsWith('/api/media/')) return await uploadMedia(request, env, u.pathname, mediaManifest);
      if (u.pathname === '/logo.png') {
        return new Response(Uint8Array.from(atob(logoPng), c => c.charCodeAt(0)), {
          headers: {
            'content-type': 'image/png',
            'cache-control': 'public, max-age=86400'
          }
        });
      }
      if (u.pathname === '/api/room' && request.method === 'POST') return await roomApi(request, env);
      return new Response(html, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'x-content-type-options': 'nosniff'
        }
      });
    } catch (e) {
      console.error(e);
      return json({ error: 'Bağlantı kurulamadı. Lütfen tekrar dene.' }, 500);
    }
  }
};
