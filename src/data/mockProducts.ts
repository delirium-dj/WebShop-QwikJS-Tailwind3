/**
 * Mock Product Data
 *
 * Sample product data with images for testing and development.
 * Integrated with 40 products inspired by FakeStore API as a backup.
 */

import type { ProductImage } from "../utils/image";

/**
 * Type definition for Mock Product
 * Note: id is a number to maintain compatibility with the main Product interface
 */
export interface MockProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  category: string;
  rating: number;
  inStock: boolean;
  description: string;
  createdAt: Date;
}

/**
 * Sample product data for testing ProductCard component
 * Contains 40 products from/inspired by FakeStore API
 */
export const mockProducts: MockProduct[] = [
  {
    id: 1,
    name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    slug: "fjallraven-foldsack-no-1-backpack",
    price: 109.95,
    originalPrice: 139.95,
    images: [
      {
        id: "img-1",
        url: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        alt: "Fjallraven Backpack",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Men's Clothing",
    rating: 3.9,
    inStock: true,
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
    createdAt: new Date("2025-12-01"),
  },
  {
    id: 2,
    name: "Mens Casual Premium Slim Fit T-Shirts",
    slug: "mens-casual-premium-slim-fit-t-shirts",
    price: 22.3,
    originalPrice: 29.99,
    images: [
      {
        id: "img-2",
        url: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        alt: "Slim Fit T-Shirts",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Men's Clothing",
    rating: 4.1,
    inStock: true,
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric.",
    createdAt: new Date("2025-12-02"),
  },
  {
    id: 3,
    name: "Mens Cotton Jacket",
    slug: "mens-cotton-jacket",
    price: 55.99,
    originalPrice: 69.99,
    images: [
      {
        id: "img-3",
        url: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
        alt: "Cotton Jacket",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Men's Clothing",
    rating: 4.7,
    inStock: true,
    description:
      "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions.",
    createdAt: new Date("2025-12-03"),
  },
  {
    id: 4,
    name: "Mens Casual Slim Fit",
    slug: "mens-casual-slim-fit",
    price: 15.99,
    originalPrice: 19.99,
    images: [
      {
        id: "img-4",
        url: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
        alt: "Casual Slim Fit",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Men's Clothing",
    rating: 2.1,
    inStock: true,
    description:
      "Body builds vary by person, therefore, detailed size information should be reviewed.",
    createdAt: new Date("2025-12-04"),
  },
  {
    id: 5,
    name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    slug: "john-hardy-womens-legends-naga-bracelet",
    price: 695,
    originalPrice: 850,
    images: [
      {
        id: "img-5",
        url: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        alt: "Dragon Chain Bracelet",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Jewelery",
    rating: 4.6,
    inStock: true,
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
    createdAt: new Date("2025-12-05"),
  },
  {
    id: 6,
    name: "Solid Gold Petite Micropave",
    slug: "solid-gold-petite-micropave",
    price: 168,
    originalPrice: 210,
    images: [
      {
        id: "img-6",
        url: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
        alt: "Gold Petite Micropave",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Jewelery",
    rating: 3.9,
    inStock: true,
    description:
      "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center.",
    createdAt: new Date("2025-12-06"),
  },
  {
    id: 7,
    name: "White Gold Plated Princess",
    slug: "white-gold-plated-princess",
    price: 9.99,
    originalPrice: 15.99,
    images: [
      {
        id: "img-7",
        url: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
        alt: "White Gold Plated Princess",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Jewelery",
    rating: 3.0,
    inStock: true,
    description:
      "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her.",
    createdAt: new Date("2025-12-07"),
  },
  {
    id: 8,
    name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
    slug: "pierced-owl-rose-gold-plated-stainless-steel",
    price: 10.99,
    originalPrice: 13.99,
    images: [
      {
        id: "img-8",
        url: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
        alt: "Double Flared Tunnel Plug Earrings",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Jewelery",
    rating: 1.9,
    inStock: true,
    description:
      "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel.",
    createdAt: new Date("2025-12-08"),
  },
  {
    id: 9,
    name: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    slug: "wd-2tb-elements-portable-external-hard-drive",
    price: 64,
    originalPrice: 79.99,
    images: [
      {
        id: "img-9",
        url: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
        alt: "WD External Hard Drive",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 3.3,
    inStock: true,
    description:
      "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity.",
    createdAt: new Date("2025-12-09"),
  },
  {
    id: 10,
    name: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    slug: "sandisk-ssd-plus-1tb-internal-ssd",
    price: 109,
    originalPrice: 129,
    images: [
      {
        id: "img-10",
        url: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
        alt: "SanDisk SSD",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 2.9,
    inStock: true,
    description:
      "Easy upgrade for faster boot up, shutdown, application load and response.",
    createdAt: new Date("2025-12-10"),
  },
  {
    id: 11,
    name: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache",
    slug: "silicon-power-256gb-ssd-3d-nand-a55",
    price: 109,
    originalPrice: 129.99,
    images: [
      {
        id: "img-11",
        url: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
        alt: "Silicon Power SSD",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 4.8,
    inStock: true,
    description:
      "3D NAND flash are applied to deliver high transfer speeds and system performance.",
    createdAt: new Date("2025-12-11"),
  },
  {
    id: 12,
    name: "WD 4TB Gaming Drive Works with Playstation 4 Portable",
    slug: "wd-4tb-gaming-drive-portable",
    price: 114,
    originalPrice: 149,
    images: [
      {
        id: "img-12",
        url: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
        alt: "WD 4TB Gaming Drive",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 4.8,
    inStock: true,
    description:
      "Expand your PS4 gaming experience, Play anywhere Fast and easy setup, Sleek design.",
    createdAt: new Date("2025-12-12"),
  },
  {
    id: 13,
    name: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS",
    slug: "acer-sb220q-bi-21-5-inches-ips",
    price: 599,
    originalPrice: 699,
    images: [
      {
        id: "img-13",
        url: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
        alt: "Acer Monitor",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 2.9,
    inStock: true,
    description:
      "21.5 inches Full HD (1920 x 1080) widescreen IPS display | Radeon free Sync technology.",
    createdAt: new Date("2025-12-13"),
  },
  {
    id: 14,
    name: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
    slug: "samsung-49-inch-curved-gaming-monitor",
    price: 999.99,
    originalPrice: 1199.99,
    images: [
      {
        id: "img-14",
        url: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
        alt: "Samsung 49-Inch Monitor",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 2.2,
    inStock: true,
    description:
      "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR QUANTUM DOT (QLED) TECHNOLOGY.",
    createdAt: new Date("2025-12-14"),
  },
  {
    id: 15,
    name: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    slug: "biylaclesen-womens-3-in-1-snowboard-jacket",
    price: 56.99,
    originalPrice: 79.99,
    images: [
      {
        id: "img-15",
        url: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
        alt: "Women's Snowboard Jacket",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 2.6,
    inStock: true,
    description:
      "Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweight and Warm.",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: 16,
    name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    slug: "lock-and-love-womens-faux-leather-jacket",
    price: 29.95,
    originalPrice: 39.95,
    images: [
      {
        id: "img-16",
        url: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
        alt: "Faux Leather Moto Jacket",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 2.9,
    inStock: true,
    description:
      "Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style.",
    createdAt: new Date("2025-12-16"),
  },
  {
    id: 17,
    name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    slug: "rain-jacket-women-windbreaker-striped",
    price: 39.99,
    originalPrice: 49.99,
    images: [
      {
        id: "img-17",
        url: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.png",
        alt: "Women's Rain Jacket",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 3.8,
    inStock: true,
    description:
      "Lightweight perfect for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design.",
    createdAt: new Date("2025-12-17"),
  },
  {
    id: 18,
    name: "MBJ Women's Solid Short Sleeve Boat Neck V",
    slug: "mbj-womens-solid-short-sleeve-boat-neck",
    price: 9.85,
    originalPrice: 12.99,
    images: [
      {
        id: "img-18",
        url: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
        alt: "Short Sleeve Boat Neck",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 4.7,
    inStock: true,
    description:
      "Lightweight fabric with great stretch for comfort. Made in USA or Imported.",
    createdAt: new Date("2025-12-18"),
  },
  {
    id: 19,
    name: "Opna Women's Short Sleeve Moisture",
    slug: "opna-womens-short-sleeve-moisture",
    price: 7.95,
    originalPrice: 9.99,
    images: [
      {
        id: "img-19",
        url: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
        alt: "Short Sleeve Moisture",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 4.5,
    inStock: true,
    description:
      "Machine wash, 100% cationic polyester interlock. Lightweight, roomy and highly breathable.",
    createdAt: new Date("2025-12-19"),
  },
  {
    id: 20,
    name: "DANVOUY Womens T Shirt Casual Cotton Short",
    slug: "danvouy-womens-t-shirt-casual-cotton",
    price: 12.99,
    originalPrice: 15.99,
    images: [
      {
        id: "img-20",
        url: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
        alt: "Casual Cotton T-Shirt",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 3.6,
    inStock: true,
    description:
      "Casual, Short Sleeve, Letter Print, V-Neck, Fashion Tees. The fabric is soft and has some stretch.",
    createdAt: new Date("2025-12-20"),
  },
  // Duplicate for backup to reach 40 products
  {
    id: 21,
    name: "Premium Backpack Vol 2",
    slug: "premium-backpack-vol-2",
    price: 119.99,
    originalPrice: 149.99,
    images: [
      {
        id: "img-21",
        url: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        alt: "Fjallraven Backpack v2",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Men's Clothing",
    rating: 4.2,
    inStock: true,
    description:
      "Enhanced security version of our classic backpack. Includes RFID blocking pocket.",
    createdAt: new Date("2025-12-21"),
  },
  {
    id: 22,
    name: "Heritage Slim Fit Tee",
    slug: "heritage-slim-fit-tee",
    price: 24.5,
    originalPrice: 32.0,
    images: [
      {
        id: "img-22",
        url: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        alt: "Heritage Tee",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Men's Clothing",
    rating: 4.4,
    inStock: true,
    description:
      "The classic slim fit tee, now in sustainable cotton. High durability seams.",
    createdAt: new Date("2025-12-22"),
  },
  {
    id: 23,
    name: "Winter Cotton Shell",
    slug: "winter-cotton-shell",
    price: 64.99,
    originalPrice: 89.99,
    images: [
      {
        id: "img-23",
        url: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
        alt: "Winter Shell",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Men's Clothing",
    rating: 4.8,
    inStock: true,
    description:
      "Reinforced winter shell variant of the classic cotton jacket. Improved insulation.",
    createdAt: new Date("2025-12-23"),
  },
  {
    id: 24,
    name: "Urban Slim Fit Trousers",
    slug: "urban-slim-fit-trousers",
    price: 18.99,
    originalPrice: 24.99,
    images: [
      {
        id: "img-24",
        url: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
        alt: "Urban Trousers",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Men's Clothing",
    rating: 3.5,
    inStock: true,
    description:
      "Match these slim fit shirts with our new urban trousers collection.",
    createdAt: new Date("2025-12-24"),
  },
  {
    id: 25,
    name: "Eternal Naga Bracelet Silver",
    slug: "eternal-naga-bracelet-silver",
    price: 595,
    originalPrice: 750,
    images: [
      {
        id: "img-25",
        url: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        alt: "Eternal Naga Bracelet",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Jewelery",
    rating: 4.9,
    inStock: true,
    description:
      "Pure silver variant of the Legends Naga Dragon Bracelet. Hand-crafted excellence.",
    createdAt: new Date("2025-12-25"),
  },
  {
    id: 26,
    name: "Micropave Diamond Studs",
    slug: "micropave-diamond-studs",
    price: 188,
    originalPrice: 240,
    images: [
      {
        id: "img-26",
        url: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
        alt: "Diamond Studs",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Jewelery",
    rating: 4.1,
    inStock: true,
    description:
      "Compact micropave earrings matching the Solid Gold Petite Micropave pendant.",
    createdAt: new Date("2025-12-26"),
  },
  {
    id: 27,
    name: "Imperial Princess Ring",
    slug: "imperial-princess-ring",
    price: 14.99,
    originalPrice: 19.99,
    images: [
      {
        id: "img-27",
        url: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
        alt: "Imperial Princess Ring",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Jewelery",
    rating: 3.8,
    inStock: true,
    description:
      "Luxury wedding solitaire with enhanced plated finish for longer shine.",
    createdAt: new Date("2025-12-27"),
  },
  {
    id: 28,
    name: "Stainless Steel Tunnel Gold",
    slug: "stainless-steel-tunnel-gold",
    price: 15.99,
    originalPrice: 21.99,
    images: [
      {
        id: "img-28",
        url: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
        alt: "Gold Tunnel",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Jewelery",
    rating: 2.5,
    inStock: true,
    description:
      "Double flared tunnel plug earrings in high-grade surgical stainless steel.",
    createdAt: new Date("2025-12-28"),
  },
  {
    id: 29,
    name: "Elements Pro 4TB Hard Drive",
    slug: "elements-pro-4tb-hard-drive",
    price: 89.99,
    originalPrice: 109.99,
    images: [
      {
        id: "img-29",
        url: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
        alt: "4TB Elements Pro",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    description:
      "Professional high-capacity version. Faster 7200 RPM drive inside.",
    createdAt: new Date("2025-12-29"),
  },
  {
    id: 30,
    name: "SanDisk SSD Ultra 2TB",
    slug: "sandisk-ssd-ultra-2tb",
    price: 199,
    originalPrice: 249,
    images: [
      {
        id: "img-30",
        url: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
        alt: "SanDisk 2TB SSD",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 3.9,
    inStock: true,
    description: "Double the capacity, same incredible SATA III 6 Gb/s speed.",
    createdAt: new Date("2025-12-30"),
  },
  {
    id: 31,
    name: "Silicon Power Multi-Pack SSD",
    slug: "silicon-power-multi-pack-ssd",
    price: 280,
    originalPrice: 350,
    images: [
      {
        id: "img-31",
        url: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
        alt: "Multi-Pack SSD",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 4.6,
    inStock: true,
    description:
      "A bundle of three 256GB SSDs for multi-device workspace upgrades.",
    createdAt: new Date("2025-12-31"),
  },
  {
    id: 32,
    name: "Playstation 5 External 8TB",
    slug: "playstation-5-external-8tb",
    price: 209,
    originalPrice: 259,
    images: [
      {
        id: "img-32",
        url: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
        alt: "8TB External Drive",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 4.9,
    inStock: true,
    description:
      "Ultimate storage expansion for the latest generation of consoles.",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: 33,
    name: "Acer 4K Ultra Slim 27",
    slug: "acer-4k-ultra-slim-27",
    price: 899,
    originalPrice: 1099,
    images: [
      {
        id: "img-33",
        url: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
        alt: "Acer 27 Inch 4K",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 3.5,
    inStock: true,
    description:
      "Upgrade to 4K resolution on a stunning 27-inch zero-frame IPS panel.",
    createdAt: new Date("2026-01-02"),
  },
  {
    id: 34,
    name: "Samsung Odyssey Neo G9",
    slug: "samsung-odyssey-neo-g9",
    price: 1499.99,
    originalPrice: 1799.99,
    images: [
      {
        id: "img-34",
        url: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
        alt: "Odyssey Neo G9",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Electronics",
    rating: 4.7,
    inStock: true,
    description:
      "The peak of super ultrawide monitors. HDR2000 support and 240Hz refresh.",
    createdAt: new Date("2026-01-03"),
  },
  {
    id: 35,
    name: "Extreme Snowboard Jacket Pro",
    slug: "extreme-snowboard-jacket-pro",
    price: 99.99,
    originalPrice: 139.99,
    images: [
      {
        id: "img-35",
        url: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
        alt: "Snowboard Jacket Pro",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 4.3,
    inStock: true,
    description:
      "Advanced Gore-Tex variant for professional snowboarding and extreme cold.",
    createdAt: new Date("2026-01-04"),
  },
  {
    id: 36,
    name: "Heritage Faux Leather Biker",
    slug: "heritage-faux-leather-biker",
    price: 49.95,
    originalPrice: 65.0,
    images: [
      {
        id: "img-36",
        url: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
        alt: "Heritage Biker Jacket",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 4.0,
    inStock: true,
    description:
      "Authentic biker cut with premium faux leather finish and heavy-duty zippers.",
    createdAt: new Date("2026-01-05"),
  },
  {
    id: 37,
    name: "Adventure Windbreaker Elite",
    slug: "adventure-windbreaker-elite",
    price: 59.99,
    originalPrice: 79.99,
    images: [
      {
        id: "img-37",
        url: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.png",
        alt: "Windbreaker Elite",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 4.2,
    inStock: true,
    description:
      "Professional climbing raincoats with enhanced water resistance technology.",
    createdAt: new Date("2026-01-06"),
  },
  {
    id: 38,
    name: "Soft Cotton Boat Neck Collection",
    slug: "soft-cotton-boat-neck-collection",
    price: 19.85,
    originalPrice: 25.99,
    images: [
      {
        id: "img-38",
        url: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
        alt: "Boat Neck Collection",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 4.8,
    inStock: true,
    description:
      "Higher gsm cotton fabric for a premium luxury feel on our classic boat neck.",
    createdAt: new Date("2026-01-07"),
  },
  {
    id: 39,
    name: "Performance Sports Tee Elite",
    slug: "performance-sports-tee-elite",
    price: 14.95,
    originalPrice: 19.99,
    images: [
      {
        id: "img-39",
        url: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
        alt: "Sports Tee Elite",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 4.6,
    inStock: true,
    description:
      "Enhanced moisture-wicking technology for high-intensity training sessions.",
    createdAt: new Date("2026-01-08"),
  },
  {
    id: 40,
    name: "Casual Sunday Tee Comfort",
    slug: "casual-sunday-tee-comfort",
    price: 16.99,
    originalPrice: 22.99,
    images: [
      {
        id: "img-40",
        url: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
        alt: "Sunday Tee Comfort",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Women's Clothing",
    rating: 4.1,
    inStock: true,
    description:
      "Ultra-soft cotton blend optimized for maximum comfort during lounging.",
    createdAt: new Date("2026-01-09"),
  },
];

/**
 * Get a single product by ID
 */
export const getProductById = (id: number) => {
  return mockProducts.find((product) => product.id === id);
};

/**
 * Get a single product by slug
 */
export const getProductBySlug = (slug: string) => {
  return mockProducts.find((product) => product.slug === slug);
};

/**
 * Get the latest featured products (most recently added)
 * @param count Number of products to return (default: 4)
 */
export const getLatestProducts = (count: number = 4) => {
  return [...mockProducts]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Newest first
    })
    .slice(0, count)
    .map((product) => ({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.images[0]?.url || "/images/placeholder.jpg",
    }));
};
