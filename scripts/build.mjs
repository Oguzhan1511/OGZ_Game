import fs from 'node:fs';
import path from 'node:path';

function readModuleCode(name) {
  const filePath = `worker/${name}.js`;
  let content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/from\s+['"]\.\/([^'"]+)['"]/);
  if (match) {
    const resolved = path.join('worker', match[1]);
    if (fs.existsSync(resolved)) {
      content = fs.readFileSync(resolved, 'utf8');
    }
  }
  return content;
}

let code = fs.readFileSync('worker/index.js', 'utf8');
const moduleNames = [
  'mode-cards', 'product-ui', 'products', 'desktop-game', 'round-ranking',
  'mobile-game', 'guess-input', 'deployment', 'ocr-engine', 'supabase',
  'admin', 'selection', 'catalog', 'media-manifest', 'game-modes'
];

for (const name of moduleNames) {
  code = code.replace(
    new RegExp('import \\{[^\\n]+\\} from "\\./' + name + '\\.js";'),
    () => readModuleCode(name)
      .replaceAll('export const ', 'const ')
      .replaceAll('export function ', 'function ')
      .replaceAll('export async function ', 'async function ')
  );
}

code = code.replace(
  'import { ocrClient } from "./ocr.js";',
  readModuleCode('ocr')
    .replaceAll('export const ', 'const ')
    .replaceAll('export function ', 'function ')
);

code = code.replaceAll(/import \{[^\n]+\} from ["']\.\/supabase\.js["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["']\.\/products\.js["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["']\.\/game-modes\.js["'];?/g, '');
code = code.replaceAll(/import \{[^\n]+\} from ["']\.\.\/ocr\/ocr\.js["'];?/g, '');
code = code.replace('const cars=baseCars;', 'const baseCars=cars;');

fs.mkdirSync('dist/server', { recursive: true });
fs.writeFileSync('dist/server/index.js', code);
