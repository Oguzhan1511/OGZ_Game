import fs from 'node:fs';
import crypto from 'node:crypto';
import readline from 'node:readline';
import {mediaManifest} from '../worker/media-manifest.js';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
process.stdout.write('Ready for media upload JSON on stdin (input is hidden).\n');
let input='';for await(const chunk of process.stdin){input+=chunk;if(input.includes('\n'))break}
if(process.stdin.isTTY)process.stdin.setRawMode(false);
const config=JSON.parse(input.trim());let completed=0;const queue=Object.entries(mediaManifest);
await Promise.all(Array.from({length:4},async()=>{while(queue.length){const [path,meta]=queue.shift();const bytes=fs.readFileSync(new URL('../assets/listings/'+path.split('/').pop(),import.meta.url));const headers={'authorization':'Bearer '+config.key,'OAI-Sites-Authorization':'Bearer '+config.bypass,'content-type':meta.type};let ok=false;for(let attempt=0;attempt<3;attempt++){const r=await fetch(config.origin+'/api'+path,{method:'PUT',headers,body:bytes});if(r.ok){ok=true;break}if(attempt===2)throw Error('Upload failed '+path+' '+r.status)}if(ok){const r=await fetch(config.origin+path,{headers:{'OAI-Sites-Authorization':'Bearer '+config.bypass}});if(!r.ok)throw Error('Read failed '+path+' '+r.status);const data=Buffer.from(await r.arrayBuffer());if(crypto.createHash('sha256').update(data).digest('hex')!==meta.sha256)throw Error('Hash mismatch '+path);completed++;if(completed%20===0)console.log(completed+'/164 uploaded and verified')}}}));console.log(JSON.stringify({uploaded:completed,verified:completed}));process.exit(0);
