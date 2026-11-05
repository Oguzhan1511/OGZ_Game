import { optimizedImagePaths } from './image-variants.js';
const optimizedImageSet = new Set(optimizedImagePaths);
export function gameImage(url) {
  if (typeof url !== 'string') return url;
  const prefix = 'https://kwidsvgcwcgjydfybtfv.supabase.co/storage/v1/object/public/ogz-game/';
  if (!url.startsWith(prefix)) return url;
  const path = url.slice(prefix.length);
  return optimizedImageSet.has(path)
    ? prefix + 'media/optimized/' + path.replace(/[/.]/g, '_') + '_v1.webp'
    : url;
}
