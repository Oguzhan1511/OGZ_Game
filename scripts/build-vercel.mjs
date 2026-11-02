import fs from 'node:fs';
fs.mkdirSync('public',{recursive:true});fs.writeFileSync('public/.gitkeep','');console.log('Vercel gateway ready. Game API: Worker; game state, listings, products and images: Supabase.');
