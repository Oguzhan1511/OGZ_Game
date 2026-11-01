import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url).pathname;
const images=fs.readFileSync(path.join(root,'data/images.tsv'),'utf8').trim().split('\n').map(x=>x.split('|'));
const tmp='/var/folders/1s/x5d2p1vx1_1g1cny2klfq8980000gn/T';
const assetDir=path.join(root,'assets/listings');fs.mkdirSync(assetDir,{recursive:true});
for(const [alias,photo,damage,rect] of images){
 const input=path.join(tmp,'codex-clipboard-'+photo+'.png'),diagram=path.join(tmp,'codex-clipboard-'+damage+'.png');
 const [x,y,w,h]=rect.split(',').map(Number);
 const target=path.join(assetDir,alias+'-photo.jpg');
 // Extract only the original photograph. No generation, retouching or replacement.
 execFileSync('sips',['--cropToHeightWidth',String(h),String(w),'--cropOffset',String(y),String(x),input,'--out',target,'-s','format','jpeg','-s','formatOptions','78'],{stdio:'pipe'});
 fs.copyFileSync(diagram,path.join(assetDir,alias+'-damage.png'));
}
console.log('Prepared '+images.length+' original photos and unchanged diagrams.');
