import fs from 'node:fs';

const moduleMap = [
  ['./modes/auction/auction-seed.js','worker/modes/auction/auction-seed.js'],
  ['./modes/auction/auction-selection.js','worker/modes/auction/auction-selection.js'],
  ['./ui/final-standings.js','worker/ui/final-standings.js'],
  ['./ui/game-audio.js','worker/ui/game-audio.js'],
  ['./room-lifecycle.js','worker/room-lifecycle.js'],
  ['./performance.js','worker/performance.js'],
  ['./image-variants.js','worker/image-variants.js'],
  ['./ui/assets.js', 'worker/ui/assets.js'],
  ['./ui/mode-cards.js', 'worker/ui/mode-cards.js'],
  ['./modes/product/product-ui.js', 'worker/modes/product/product-ui.js'],
  ['./modes/product/products.js', 'worker/modes/product/products.js'],
  ['./modes/auction/auction-admin.js', 'worker/modes/auction/auction-admin.js'],
  ['./modes/auction/auction-ui.js', 'worker/modes/auction/auction-ui.js'],
  ['./modes/auction/auction.js', 'worker/modes/auction/auction.js'],
  ['./services/game-db.js', 'worker/services/game-db.js'],
  ['./ui/desktop-game.js', 'worker/ui/desktop-game.js'],
  ['./ui/round-ranking.js', 'worker/ui/round-ranking.js'],
  ['./ui/mobile-game.js', 'worker/ui/mobile-game.js'],
  ['./ui/guess-input.js', 'worker/ui/guess-input.js'],
  ['./services/deployment.js', 'worker/services/deployment.js'],
  ['./ocr/ocr-engine.js', 'worker/ocr/ocr-engine.js'],
  ['./services/supabase.js', 'worker/services/supabase.js'],
  ['./services/admin.js', 'worker/services/admin.js'],
  ['./selection.js', 'worker/selection.js'],
  ['./modes/car/catalog.js', 'worker/modes/car/catalog.js'],
  ['./modes/car/media-manifest.js', 'worker/modes/car/media-manifest.js'],
  ['./game-modes.js', 'worker/game-modes.js'],
  ['./services/room-service.js', 'worker/services/room-service.js'],
  ['./services/media.js', 'worker/services/media.js'],
  ['./ui/app-shell.js', 'worker/ui/app-shell.js']
];

let code = fs.readFileSync('worker/index.js', 'utf8');

for (const [specifier, filePath] of moduleMap) {
  const content = fs.readFileSync(filePath, 'utf8')
    .replaceAll('export const ', 'const ')
    .replaceAll('export function ', 'function ')
    .replaceAll('export async function ', 'async function ');
  const escaped = specifier.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  code = code.replace(new RegExp('import \\{[^\\n]+\\} from "' + escaped + '";'), () => content);
}

const ocrContent = fs.readFileSync('worker/ocr/ocr.js', 'utf8')
  .replaceAll('export const ', 'const ')
  .replaceAll('export function ', 'function ');
code = code.replace('import { ocrClient } from "./ocr/ocr.js";', ocrContent);
code = code.replace('import { ocrClient } from "../ocr/ocr.js";', ocrContent);

code = code.replaceAll(/import \{[^\n]+\} from ["'][^"']*supabase(\.js)?["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["'][^"']*products(\.js)?["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["'][^"']*auction(\.js)?["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["'][^"']*auction-admin(\.js)?["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["']\.\/game-modes\.js["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["']\.\.\/ocr\/ocr\.js["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["']\.\/room-service\.js["'];?/g, '');

code=code.replaceAll(/import \{[^\n]+\} from ["'][^"']*performance\.js["'];?/g,'');
code=code.replaceAll(/import \{[^\n]+\} from ["'][^"']*room-lifecycle\.js["'];?/g,'');
code=code.replaceAll(/import \{[^\n]+\} from ["'][^"']*auction-selection\.js["'];?/g,'');
code=code.replaceAll(/import \{[^\n]+\} from ["'][^"']*auction-seed\.js["'];?/g,'');
fs.mkdirSync('dist/server', { recursive: true });
fs.writeFileSync('dist/server/index.js', code);
console.log('8. scripts/build.mjs updated and bundled successfully');
