import fs from 'node:fs';
fs.mkdirSync('public',{recursive:true});fs.writeFileSync('public/.gitkeep','');console.log('Vercel gateway ready. Game backend: Cloudflare D1/R2; listings: Supabase.');
