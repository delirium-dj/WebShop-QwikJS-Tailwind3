/**
 * IMAGE UTILITIES COMPATIBILITY SHIM
 *
 * This file maintains backward compatibility with the old file structure.
 * All image utilities have been consolidated into:
 *   src/utils/image.ts
 *
 * This file simply re-exports from there, so existing imports continue to work.
 *
 * For Junior Developers:
 * When you see a file that just re-exports from another file, it's usually for
 * backward compatibility. Old code can still import from here, while new code
 * should import directly from src/utils/image.ts
 *
 * Migration path:
 * Instead of: import { getOptimizedImageUrl } from '~/utils/image.utils';
 * Use:        import { getOptimizedImageUrl } from '~/utils/image';
 */

// Re-export all image utilities from the consolidated file
export {
  getOptimizedImageUrl,
  generateSrcSet,
  getPrimaryImage,
  getSizeDimensions,
  getPlaceholderImage,
  validateImageUrl,
  preloadImage,
} from "./image";
