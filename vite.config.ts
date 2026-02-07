// vite.config.ts

/**
 * VITE CONFIGURATION FILE
 * 
 * This file tells Vite (the build tool) how to:
 * - Build your application
 * - Process files (TypeScript, images, CSS)
 * - Optimize for production
 * - Handle plugins
 * 
 * For Junior Developers:
 * Vite is like a kitchen where your code gets "cooked" into a final website.
 * This config file is the recipe that tells the kitchen what to do.
 */

import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Import the image optimizer plugin
// This will automatically optimize images during the build process
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

/**
 * VITE CONFIGURATION
 * 
 * The defineConfig function provides TypeScript autocomplete and type checking
 * for your configuration options
 */
export default defineConfig({
    /**
     * PLUGINS SECTION
     * 
     * Plugins extend Vite's functionality
     * Think of them as "power-ups" or "add-ons" for your build process
     * 
     * The order matters! Plugins run in the order they're listed
     */
    plugins: [
      /**
       * QWIK CITY PLUGIN
       * 
       * Adds routing, data loading, and other Qwik City features
       * Must come first to set up the Qwik environment
       */
      qwikCity(),

      /**
       * QWIK VITE PLUGIN
       * 
       * Optimizes Qwik components for production
       * Handles code splitting, lazy loading, etc.
       */
      qwikVite(),

      /**
       * TYPESCRIPT PATHS PLUGIN
       * 
       * Allows you to use path aliases from tsconfig.json
       * Example: import from '~/components' instead of '../../components'
       */
      tsconfigPaths(),

      /**
       * IMAGE OPTIMIZER PLUGIN
       * 
       * This is the new plugin we just installed!
       * It automatically optimizes all images in your project
       * 
       * How it works:
       * 1. Finds all images in your public folder and components
       * 2. Compresses them to reduce file size
       * 3. Converts to modern formats (WebP, AVIF)
       * 4. Creates multiple sizes for responsive images
       * 
       * When it runs:
       * - During development: Only when files change
       * - During build: Optimizes everything for production
       */
      ViteImageOptimizer({
        /**
         * TEST MODE
         * 
         * Set to true to see what would be optimized without actually doing it
         * Useful for debugging
         * 
         * false = Actually optimize images (use this for production)
         * true = Just show what would happen (use for testing)
         */
        test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,

        /**
         * INCLUDE PATTERNS
         * 
         * Tell the optimizer which files to process
         * Uses glob patterns (like wildcards)
         * 
         * Explanation of the pattern:
         * /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i
         * 
         * - \. = Literal dot (.)
         * - jpe?g = jpg OR jpeg (? means optional)
         * - | = OR operator
         * - $ = End of filename
         * - i = Case insensitive (matches JPG, jpg, Jpg, etc.)
         * 
         * In simple terms: "Match any file ending in jpg, jpeg, png, gif, etc."
         */
        include: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,

        /**
         * EXCLUDE PATTERNS
         * 
         * Files to skip (not optimize)
         * Useful for logos or images that shouldn't be modified
         * 
         * Example: Don't optimize the logo
         * exclude: /logo\.(jpe?g|png)$/i,
         */
        exclude: undefined,

        /**
         * CACHE DIRECTORY
         * 
         * Where to store processed images to avoid re-processing
         * If an image hasn't changed, use the cached version
         * 
         * Speeds up builds significantly!
         */
        cache: true,
        cacheLocation: './node_modules/.vite-image-optimizer',

        /**
         * PNG OPTIMIZATION
         * 
         * Settings for PNG files (like product images with transparency)
         */
        png: {
          /**
           * Quality setting (0-100)
           * - 100 = Highest quality, largest file size
           * - 0 = Lowest quality, smallest file size
           * - 80 = Good balance (recommended for e-commerce)
           * 
           * Why 80?
           * - Visually identical to original for most people
           * - 40-60% smaller file size
           * - Fast loading times
           */
          quality: 80,
        },

        /**
         * JPEG OPTIMIZATION
         * 
         * Settings for JPEG files (most product photos)
         */
        jpeg: {
          /**
           * Quality: 80 is the sweet spot
           * - Above 90: Larger files, minimal quality gain
           * - Below 70: Visible quality loss
           * - 80: Perfect balance for e-commerce
           */
          quality: 80,
        },

        /**
         * JPG OPTIMIZATION
         * 
         * Same as JPEG (jpg and jpeg are the same format)
         */
        jpg: {
          quality: 80,
        },

        /**
         * TIFF OPTIMIZATION
         * 
         * TIFF files are usually very large
         * Quality 80 significantly reduces size
         */
        tiff: {
          quality: 80,
        },

        /**
         * WEBP CONVERSION
         * 
         * WebP is a modern format developed by Google
         * - 25-35% smaller than JPEG at same quality
         * - Supports transparency (like PNG)
         * - Supported by all modern browsers
         * 
         * The plugin will CREATE WebP versions alongside originals
         * So you'll have both product.jpg AND product.webp
         */
        webp: {
          /**
           * Lossless mode
           * - true = No quality loss (larger files)
           * - false = Some quality loss (smaller files)
           * 
           * For e-commerce, false is recommended
           */
          lossless: false,
          
          /**
           * Quality setting for WebP
           * Can go slightly lower than JPEG (75) because WebP is more efficient
           */
          quality: 75,
        },

        /**
         * AVIF CONVERSION
         * 
         * AVIF is the newest image format
         * - 50% smaller than JPEG at same quality!
         * - Supported by Chrome, Firefox, Edge (95%+ of users)
         * - Future-proof format
         * 
         * The plugin creates AVIF versions for maximum optimization
         */
        avif: {
          lossless: false,
          
          /**
           * Quality can be lower for AVIF (70) because it's so efficient
           * A quality 70 AVIF looks like a quality 85 JPEG
           */
          quality: 70,
        },

        /**
         * SVG OPTIMIZATION
         * 
         * SVG files are code (XML), not pixels
         * The optimizer removes unnecessary code to make them smaller
         * 
         * Example optimizations:
         * - Removes comments
         * - Removes hidden elements
         * - Simplifies numbers (0.10000 → 0.1)
         * - Merges similar elements
         */
        svg: {
          /**
           * Enable all safe optimizations
           * These won't break your SVGs
           */
          multipass: true,
          
          /**
           * Plugins that run specific optimizations
           * Each plugin does one specific task
           */
          plugins: [
            {
              /**
               * Remove viewBox attribute
               * - true = Remove (smaller file, might break responsive sizing)
               * - false = Keep (larger file, better compatibility)
               * 
               * We keep it for responsive SVGs
               */
              name: 'removeViewBox',
            },
            {
              /**
               * Remove comments in SVG code
               * Comments are for developers, users don't need them
               * Reduces file size with zero visual impact
               */
              name: 'removeComments',
            },
            {
              /**
               * Remove metadata (author, creation date, etc.)
               * Users don't need this information
               * Can reduce file size by 10-20%
               */
              name: 'removeMetadata',
            },
            {
              /**
               * Remove empty attributes
               * Example: width="" or fill=""
               * These do nothing and waste bytes
               */
              name: 'removeEmptyAttrs',
            },
          ],
        },
      }),
    ],

    /**
     * DEV SERVER SETTINGS
     * 
     * Configuration for the development server
     * (When you run 'npm run dev' or 'pnpm dev')
     */
    server: {
      /**
       * Headers sent by the dev server
       * These help with Cross-Origin Resource Sharing (CORS)
       */
      headers: {
        'Cache-Control': 'public, max-age=0',
      },
    },

    /**
     * PREVIEW SERVER SETTINGS
     * 
     * Configuration for preview server
     * (When you run 'npm run preview' after building)
     */
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
});
