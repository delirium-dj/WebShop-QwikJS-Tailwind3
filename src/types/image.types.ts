/**
 * IMAGE TYPES COMPATIBILITY SHIM
 *
 * This file maintains backward compatibility with the old file structure.
 * All image types and utilities have been consolidated into:
 *   src/utils/image.ts
 *
 * This file simply re-exports from there, so existing imports continue to work.
 *
 * For Junior Developers:
 * When you see a file that just re-exports from another file, it's usually for
 * backward compatibility. Old code can still import from here, while new code
 * should import directly from src/utils/image.ts
 */

// Re-export all image types from the consolidated file
export type {
  ProductImage,
  ImageSize,
  ImageConfig,
  ImageProps,
} from "../utils/image";
