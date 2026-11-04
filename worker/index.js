import {battleshipStyles,getBattleshipClient} from "./modes/battleship/battleship-ui.js";
import {numberRaceStyles,numberRaceClient} from "./modes/number/number-ui.js";
import { auctionSeed } from "./modes/auction/auction-seed.js";
import { selectAuctionItems } from "./modes/auction/auction-selection.js";
import { finalStandingsStyles, finalStandingsClient } from "./ui/final-standings.js";
import { gameAudioClient } from "./ui/game-audio.js";
import { returnToLobby } from "./room-lifecycle.js";
import { gameImage } from "./performance.js";
import { modeCardStyles, modeCardClient } from "./ui/mode-cards.js";
import { productCategories, normalizeProductCategories, productListings, productAsRound, productAdminApi } from "./modes/product/products.js";
import { productAdminHtml, productGameStyles, productGameClient } from "./modes/product/product-ui.js";
import { auctionCatalog, auctionAdminApi, auctionAdminHtml } from "./modes/auction/auction-admin.js";
import { auctionApi } from "./modes/auction/auction.js";
import { auctionStyles, auctionClient } from "./modes/auction/auction-ui.js";
import { gameDatabase, databaseMigration } from "./services/game-db.js";
import { desktopGameStyles } from "./ui/desktop-game.js";
import { roundRankingStyles, roundRankingClient } from "./ui/round-ranking.js";
import { mobileGameStyles, mobileGameClient } from "./ui/mobile-game.js";
import { guessInputClient } from "./ui/guess-input.js";
import { deploymentRequest } from "./services/deployment.js";
import { tesseractScript } from "./ocr/ocr-engine.js";
import { gameListings, syncSupabase } from "./services/supabase.js";
import { logoPng, mascotJpg, homeBackgroundWebp } from "./ui/assets.js";
import { adminApi, adminMedia, adminHtml } from "./services/admin.js";
import { selectListings } from "./selection.js";
import { cars } from "./modes/car/catalog.js";
import { mediaManifest } from "./modes/car/media-manifest.js";
import { createGameModes } from "./game-modes.js";
import { createRoomService, validProfile, json } from "./services/room-service.js";
import { serveMedia, uploadMedia } from "./services/media.js";
import { createAppShell } from "./ui/app-shell.js";

const baseCars = cars;
const gameModes = createGameModes({
  adminHtml,
  adminApi,
  gameListings,
  productCategories,
  normalizeProductCategories,
  productListings,
  productAsRound,
  productAdminHtml,
  productAdminApi,
  auctionAdminHtml,
  auctionAdminApi,
  auctionCatalog
});

const roomApi = createRoomService({ gameModes, cars, selectListings, auctionApi, auctionCatalog });
const html = createAppShell({battleshipStyles,battleshipClient:getBattleshipClient(),numberRaceStyles,numberRaceClient,
  finalStandingsStyles, finalStandingsClient,
  gameAudioClient,
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
  validProfile,
  auctionStyles,
  auctionClient
});

export default {
  async fetch(request, env) {
    try {
      let u = new URL(request.url);
      if (u.pathname === '/api/database-migration') return await databaseMigration(request, env);
      if (env.OGZ_DB_MAINTENANCE === '1' && u.pathname.startsWith('/api/')) {
        return json({ error: 'Oyun verileri güncelleniyor. Biraz sonra tekrar dene.' }, 503);
      }
      if (env.OGZ_GAME_DB === 'supabase') {
        if (!env.OGZ_SUPABASE_URL || !env.OGZ_SUPABASE_KEY) {
          return json({ error: 'Oyun veritabanı hazır değil.' }, 503);
        }
        env = { ...env, DB: gameDatabase(env) };
      }
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
      if (u.pathname === '/home-background-v1.webp') {
        return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(homeBackgroundWebp), c=>c.charCodeAt(0)), {headers:{'content-type':'image/webp','cache-control':'public, max-age=31536000, immutable'}});
      }
      if (u.pathname === '/logo.png') {
        return new Response(Uint8Array.from(atob(logoPng), c => c.charCodeAt(0)), {
          headers: {
            'content-type': 'image/png',
            'cache-control': 'public, max-age=86400'
          }
        });
      }
      if (u.pathname === '/mascot.jpg') {
        return new Response(Uint8Array.from(atob(mascotJpg), c => c.charCodeAt(0)), {
          headers: {
            'content-type': 'image/jpeg',
            'cache-control': 'public, max-age=31536000, immutable'
          }
        });
      }
      if(u.pathname==='/api/room'&&request.method==='POST'){if(env.OGZ_GAME_ENGINE==='edge')return await fetch(env.OGZ_SUPABASE_URL.replace(/ogz-game-listings\/?$/,'ogz-game-room'),{method:'POST',headers:{'x-ogz-key':env.OGZ_SUPABASE_KEY,'x-region':env.OGZ_DB_REGION||'ap-northeast-2','content-type':'application/json'},body:request.body,duplex:'half',signal:AbortSignal.timeout(30000)});return await roomApi(request,env)}
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
