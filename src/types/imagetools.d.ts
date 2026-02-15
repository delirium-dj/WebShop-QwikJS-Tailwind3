/**
 * IMAGETOOLS TYPE DECLARATIONS
 * 
 * This file helps TypeScript understand the special query strings
 * we use for image optimization in Vite.
 * 
 * Why this is needed:
 * When we import an image like "photo.jpg?as=picture", 
 * normally TypeScript thinks it's just a string. 
 * But Vite turns it into a complex object with multiple formats (AVIF, WebP).
 * This file tells TypeScript exactly what that object looks like.
 */

declare module '*?as=picture&w=400;800&format=avif;webp;jpg&quality=80' {
    /**
     * The structure of the optimized image object
     */
    const content: {
      /** Map of image formats to their source URLs */
      sources: {
        avif: string;
        webp: string;
        jpg: string;
        [key: string]: string;
      };
      /** The fallback image (usually the original format) */
      img: {
        src: string;
        w: number;
        h: number;
      };
    };
    export default content;
  }
  
  // Generic fallback for any other imagetools queries
  declare module '*?as=picture*' {
    const content: any;
    export default content;
  }
