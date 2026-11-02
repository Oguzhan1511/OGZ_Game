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

fs.writeFileSync('public/.gitkeep', '');
console.log('Vercel build complete: static index.html, mascot.jpg, logo.png generated.');
