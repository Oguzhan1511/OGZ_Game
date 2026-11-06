import fs from 'node:fs';
import worker from '../worker/index.js';

fs.mkdirSync('public', { recursive: true });

// Render home page HTML
const resHtml = await worker.fetch(new Request('http://localhost/'), {});
fs.writeFileSync('public/index.html', await resHtml.text());

// Export mascot image
const resMascot = await worker.fetch(new Request('http://localhost/mascot.jpg'), {});
fs.writeFileSync('public/mascot.jpg', Buffer.from(await resMascot.arrayBuffer()));

// Export logo
const resLogo = await worker.fetch(new Request('http://localhost/logo.png'), {});
fs.writeFileSync('public/logo.png', Buffer.from(await resLogo.arrayBuffer()));

const background = await worker.fetch(new Request('http://localhost/home-background-v1.webp'), {});
fs.writeFileSync('public/home-background-v1.webp', Buffer.from(await background.arrayBuffer()));

fs.writeFileSync('public/.gitkeep', '');
console.log('Vercel build complete: static index.html, mascot.jpg, logo.png generated.');

// Serve the same optimized lobby art on static Vercel builds and the local Worker.
fs.mkdirSync('public/lobby-art', { recursive: true });
for (const mode of ['car-price','product-price','auction','number-race','battleship']) {
 const res = await worker.fetch(new Request('http://localhost/lobby-art/'+mode+'.webp'), {});
 if (!res.ok) throw new Error('Missing lobby art: '+mode);
 fs.writeFileSync('public/lobby-art/'+mode+'.webp', Buffer.from(await res.arrayBuffer()));
}
