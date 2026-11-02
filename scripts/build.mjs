import fs from 'node:fs';
let code=fs.readFileSync('worker/index.js','utf8');
for(const name of ['mode-cards','product-ui','products','desktop-game','round-ranking','mobile-game','guess-input','deployment','ocr-engine','supabase','admin','selection','catalog','media-manifest'])code=code.replace(new RegExp('import \\{[^\\n]+\\} from "\\./'+name+'\\.js";'),()=>fs.readFileSync('worker/'+name+'.js','utf8').replaceAll('export const ','const ').replaceAll('export function ','function ').replaceAll('export async function ','async function '));
code=code.replace('import { ocrClient } from "./ocr.js";',fs.readFileSync('worker/ocr.js','utf8').replaceAll('export const ','const ').replaceAll('export function ','function '));
code=code.replaceAll(/import \{[^\n]+\} from "\.\/supabase\.js";/g,'');
code=code.replaceAll(/import \{[^\n]+\} from ['"]\.\/products\.js['"];?/g,'');
code=code.replace('const cars=baseCars;', 'const baseCars=cars;');
fs.mkdirSync('dist/server',{recursive:true});fs.writeFileSync('dist/server/index.js',code);
