import type { Artist, Category, GalleryImage, Product, Testimonial } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Paintings",
    slug: "paintings",
    description: "Original artworks and fine art prints",
    image: "/images/categories/painting.jpg",
    productCount: 48,
  },
  {
    id: "2",
    name: "Calendars",
    slug: "calendars",
    description: "Handcrafted artistic calendars",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80",
    productCount: 24,
  },
  {
    id: "3",
    name: "Custom Stickers",
    slug: "stickers",
    description: "Unique sticker packs and custom designs",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    productCount: 36,
  },
  {
    id: "4",
    name: "Mugs & Cups",
    slug: "mugs",
    description: "Artisan ceramic mugs and cups",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    productCount: 32,
  },
  {
    id: "5",
    name: "Journals",
    slug: "journals",
    description: "Handbound journals and notebooks",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
    productCount: 28,
  },
  {
    id: "6",
    name: "Home Decor",
    slug: "home-decor",
    description: "Curated pieces for beautiful living",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    productCount: 42,
  },
  {
    id: "7",
    name: "Tote Bags",
    slug: "tote-bags",
    description: "Artistic canvas tote bags",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    productCount: 18,
  },
  {
    id: "8",
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Thoughtfully curated gift sets",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    productCount: 15,
  },
  {
    id: "9",
    name: "Digital Downloads",
    slug: "digital",
    description: "Instant art for your devices",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    productCount: 56,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Watercolor Landscape Print",
    slug: "watercolor-landscape-print",
    description: "A serene watercolor landscape capturing golden hour light over rolling hills. Printed on archival cotton paper with museum-quality inks.",
    price: 2499,
    comparePrice: 2999,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
    ],
    category: "Paintings",
    categorySlug: "paintings",
    artist: "Maya Chen",
    artistSlug: "maya-chen",
    rating: 4.9,
    reviewCount: 128,
    stock: 25,
    featured: true,
    bestSeller: true,
    trending: true,
    tags: ["landscape", "watercolor", "print"],
  },
  {
    id: "p2",
    name: "Cozy Ceramic Mug",
    slug: "cozy-ceramic-mug",
    description: "Hand-thrown ceramic mug with a warm terracotta glaze. Each piece is unique with subtle variations in texture and color.",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    category: "Mugs & Cups",
    categorySlug: "mugs",
    artist: "Elena Vasquez",
    artistSlug: "elena-vasquez",
    rating: 4.8,
    reviewCount: 94,
    stock: 40,
    featured: true,
    bestSeller: true,
    tags: ["ceramic", "handmade", "mug"],
  },
  {
    id: "p3",
    name: "Botanical Journal",
    slug: "botanical-journal",
    description: "Handbound journal with pressed botanical cover art. 200 pages of acid-free paper, perfect for sketching and writing.",
    price: 1899,
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
      "https://images.unsplash.com/photo-1455393573742-b8f9b43e46cd?w=800&q=80",
    ],
    category: "Journals",
    categorySlug: "journals",
    artist: "Sofia Laurent",
    artistSlug: "sofia-laurent",
    rating: 4.7,
    reviewCount: 76,
    stock: 30,
    featured: true,
    bestSeller: true,
    tags: ["journal", "botanical", "handbound"],
  },
  {
    id: "p4",
    name: "Custom Sticker Pack",
    slug: "custom-sticker-pack",
    description: "Set of 24 vinyl stickers featuring whimsical illustrations. Waterproof, durable, and perfect for laptops, journals, and more.",
    price: 599,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d90b29b83?w=800&q=80",
    ],
    category: "Custom Stickers",
    categorySlug: "stickers",
    artist: "Luna Park",
    artistSlug: "luna-park",
    rating: 4.9,
    reviewCount: 203,
    stock: 100,
    featured: true,
    bestSeller: true,
    trending: true,
    tags: ["stickers", "vinyl", "illustration"],
  },
  {
    id: "p5",
    name: "Handmade Calendar 2026",
    slug: "handmade-calendar-2026",
    description: "Twelve months of original artwork in a beautifully designed wall calendar. Printed on premium matte paper.",
    price: 1499,
    images: [
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
    ],
    category: "Calendars",
    categorySlug: "calendars",
    artist: "Maya Chen",
    artistSlug: "maya-chen",
    rating: 4.8,
    reviewCount: 67,
    stock: 50,
    bestSeller: true,
    tags: ["calendar", "wall-art", "2026"],
  },
  {
    id: "p6",
    name: "Abstract Canvas Art",
    slug: "abstract-canvas-art",
    description: "Bold abstract expression on stretched canvas. Rich textures and earthy tones bring warmth to any space.",
    price: 8999,
    comparePrice: 10999,
    images: [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
    ],
    category: "Paintings",
    categorySlug: "paintings",
    artist: "James Okonkwo",
    artistSlug: "james-okonkwo",
    rating: 5.0,
    reviewCount: 42,
    stock: 5,
    featured: true,
    tags: ["abstract", "canvas", "original"],
  },
  {
    id: "p7",
    name: "Linen Tote Bag",
    slug: "linen-tote-bag",
    description: "Screen-printed linen tote with original botanical illustration. Spacious, durable, and sustainably made.",
    price: 1699,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      "https://images.unsplash.com/photo-1597484660312-ef4dffcf59d2?w=800&q=80",
    ],
    category: "Tote Bags",
    categorySlug: "tote-bags",
    artist: "Sofia Laurent",
    artistSlug: "sofia-laurent",
    rating: 4.6,
    reviewCount: 38,
    stock: 35,
    tags: ["tote", "linen", "botanical"],
  },
  {
    id: "p8",
    name: "Artisan Gift Box",
    slug: "artisan-gift-box",
    description: "Curated gift box with journal, mug, and sticker set. Beautifully packaged in recycled kraft box with ribbon.",
    price: 3499,
    comparePrice: 4299,
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80",
    ],
    category: "Gift Boxes",
    categorySlug: "gift-boxes",
    rating: 4.9,
    reviewCount: 56,
    stock: 20,
    featured: true,
    tags: ["gift", "bundle", "curated"],
  },
  {
    id: "p9",
    name: "Digital Wallpaper Pack",
    slug: "digital-wallpaper-pack",
    description: "Collection of 12 high-resolution artistic wallpapers for desktop and mobile. Instant download after purchase.",
    price: 499,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80",
    ],
    category: "Digital Downloads",
    categorySlug: "digital",
    artist: "Luna Park",
    artistSlug: "luna-park",
    rating: 4.7,
    reviewCount: 189,
    stock: 999,
    tags: ["digital", "wallpaper", "download"],
  },
  {
    id: "p10",
    name: "Ceramic Vase Set",
    slug: "ceramic-vase-set",
    description: "Pair of hand-glazed ceramic vases in sage and terracotta. Perfect for dried flowers or as standalone decor.",
    price: 2799,
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    category: "Home Decor",
    categorySlug: "home-decor",
    artist: "Elena Vasquez",
    artistSlug: "elena-vasquez",
    rating: 4.8,
    reviewCount: 31,
    stock: 15,
    trending: true,
    tags: ["vase", "ceramic", "decor"],
  },
  {
    id: "p11",
    name: "Minimalist Line Art Print",
    slug: "minimalist-line-art-print",
    description: "Elegant single-line portrait print on textured cotton paper. Available in multiple sizes.",
    price: 1799,
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
    ],
    category: "Paintings",
    categorySlug: "paintings",
    artist: "James Okonkwo",
    artistSlug: "james-okonkwo",
    rating: 4.6,
    reviewCount: 52,
    stock: 45,
    tags: ["minimalist", "line-art", "print"],
  },
  {
    id: "p12",
    name: "Pressed Flower Coasters",
    slug: "pressed-flower-coasters",
    description: "Set of 4 resin coasters with real pressed flowers. Each coaster is a tiny work of art.",
    price: 999,
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    category: "Home Decor",
    categorySlug: "home-decor",
    artist: "Sofia Laurent",
    artistSlug: "sofia-laurent",
    rating: 4.5,
    reviewCount: 28,
    stock: 60,
    tags: ["coasters", "flowers", "resin"],
  },
];

export const artists: Artist[] = [
  {
    id: "a1",
    name: "Maya Chen",
    slug: "maya-chen",
    bio: "Maya creates ethereal watercolor landscapes inspired by her travels through Southeast Asia. Her work celebrates the quiet beauty of natural light.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
    specialty: "Watercolor & Prints",
    location: "Portland, OR",
    productCount: 24,
  },
  {
    id: "a2",
    name: "Elena Vasquez",
    slug: "elena-vasquez",
    bio: "A ceramic artist with 15 years of experience, Elena hand-throws every piece in her sunlit studio. Her work blends traditional techniques with modern forms.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
    specialty: "Ceramics & Pottery",
    location: "Barcelona, Spain",
    productCount: 18,
  },
  {
    id: "a3",
    name: "Sofia Laurent",
    slug: "sofia-laurent",
    bio: "Sofia combines botanical illustration with bookbinding craft. Each journal tells a story through pressed flowers and hand-lettered details.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1200&q=80",
    specialty: "Journals & Botanical Art",
    location: "Provence, France",
    productCount: 21,
  },
  {
    id: "a4",
    name: "Luna Park",
    slug: "luna-park",
    bio: "Luna's whimsical illustrations bring joy to everyday objects. From stickers to digital art, her playful style has captivated collectors worldwide.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    specialty: "Illustration & Digital Art",
    location: "Seoul, South Korea",
    productCount: 32,
  },
  {
    id: "a5",
    name: "James Okonkwo",
    slug: "james-okonkwo",
    bio: "James explores abstract expressionism through bold color and texture. His large-scale canvases have been featured in galleries across three continents.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80",
    specialty: "Abstract Painting",
    location: "Lagos, Nigeria",
    productCount: 15,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    product: "Watercolor Landscape Print",
    rating: 5,
    comment: "Every product feels unique and beautifully crafted. The print quality exceeded my expectations.",
  },
  {
    id: "t2",
    name: "Marcus Webb",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    product: "Botanical Journal",
    rating: 5,
    comment: "Artisan Haven transformed my workspace. The journal is a daily source of inspiration.",
  },
  {
    id: "t3",
    name: "Anika Patel",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    product: "Cozy Ceramic Mug",
    rating: 5,
    comment: "The mug is absolutely gorgeous. You can feel the artisan's touch in every detail.",
  },
  {
    id: "t4",
    name: "David Kim",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    product: "Artisan Gift Box",
    rating: 5,
    comment: "Perfect gift for my sister. The packaging alone is a work of art.",
  },
];

export const galleryImages: GalleryImage[] = [
  { id: "g1", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80", alt: "Cozy living room styling", user: "@cozyhome", height: 320 },
  { id: "g2", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80", alt: "Gallery wall art", user: "@artlover", height: 400 },
  { id: "g3", url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80", alt: "Morning coffee ritual", user: "@slowliving", height: 280 },
  { id: "g4", url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80", alt: "Desk journaling setup", user: "@creativedesk", height: 360 },
  { id: "g5", url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80", alt: "Gift wrapping inspiration", user: "@giftguru", height: 300 },
  { id: "g6", url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80", alt: "Farmers market tote", user: "@sustainable", height: 340 },
  { id: "g7", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", alt: "Sticker collection", user: "@stickercollector", height: 260 },
  { id: "g8", url: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&q=80", alt: "Calendar wall display", user: "@organizedlife", height: 380 },
  { id: "g9", url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", alt: "Ceramic shelf styling", user: "@ceramiclove", height: 310 },
  { id: "g10", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80", alt: "Digital art workspace", user: "@digitalartist", height: 350 },
  { id: "g11", url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80", alt: "Abstract art corner", user: "@modernhome", height: 290 },
  { id: "g12", url: "https://images.unsplash.com/photo-1455393573742-b8f9b43e46cd?w=600&q=80", alt: "Reading nook", user: "@bookishhome", height: 370 },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

export function getProductsByArtist(artistSlug: string): Product[] {
  return products.filter((p) => p.artistSlug === artistSlug);
}

export function filterProducts(filters: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.categorySlug === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.reverse();
      break;
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return result;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}

export function getGiftRecommendations(
  recipient: string,
  budget: number
): Product[] {
  const budgetMap: Record<number, number> = {
    500: 500,
    1000: 1000,
    2000: 2000,
    5000: 5000,
  };
  const maxPrice = budgetMap[budget] || budget;

  const recipientTags: Record<string, string[]> = {
    friend: ["stickers", "gift", "tote"],
    partner: ["mug", "gift", "print"],
    parent: ["calendar", "decor", "vase"],
    artist: ["journal", "print", "digital"],
    student: ["stickers", "journal", "digital"],
  };

  const tags = recipientTags[recipient] || [];

  return products
    .filter((p) => p.price <= maxPrice)
    .sort((a, b) => {
      const aMatch = a.tags.some((t) => tags.includes(t)) ? 1 : 0;
      const bMatch = b.tags.some((t) => tags.includes(t)) ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 6);
}
