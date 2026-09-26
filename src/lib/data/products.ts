import type { Artist, Category, GalleryImage, Product, Testimonial } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Paintings",
    slug: "paintings",
    description: "Original artworks and fine art prints",
    image: "/images/categories/painting.jpg",
    productCount: 0,
  },
  {
    id: "2",
    name: "Calendars",
    slug: "calendars",
    description: "Handcrafted artistic calendars",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80",
    productCount: 0,
  },
  {
    id: "3",
    name: "Custom Stickers",
    slug: "stickers",
    description: "Unique sticker packs and custom designs",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    productCount: 0,
  },
  {
    id: "4",
    name: "Mugs & Cups",
    slug: "mugs",
    description: "Artisan ceramic mugs and cups",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    productCount: 0,
  },
  {
    id: "5",
    name: "Journals",
    slug: "journals",
    description: "Handbound journals and notebooks",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
    productCount: 0,
  },
  {
    id: "6",
    name: "Home Decor",
    slug: "home-decor",
    description: "Curated pieces for beautiful living",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    productCount: 0,
  },
  {
    id: "7",
    name: "Tote Bags",
    slug: "tote-bags",
    description: "Artistic canvas tote bags",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    productCount: 0,
  },
  {
    id: "8",
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Thoughtfully curated gift sets",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    productCount: 0,
  },
  {
    id: "9",
    name: "Digital Downloads",
    slug: "digital",
    description: "Instant art for your devices",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    productCount: 0,
  },
];

// Rely ONLY on Admin Uploaded Products
export const products: Product[] = [];

export const artists: Artist[] = [];

export const testimonials: Testimonial[] = [];

export const galleryImages: GalleryImage[] = [
  { id: "g1", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80", alt: "Cozy living room styling", user: "@cozyhome", height: 320 },
  { id: "g2", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80", alt: "Gallery wall art", user: "@artlover", height: 400 },
  { id: "g3", url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80", alt: "Morning coffee ritual", user: "@slowliving", height: 280 },
  { id: "g4", url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80", alt: "Desk journaling setup", user: "@creativedesk", height: 360 },
];

function getSourceProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  const norm = slug.toLowerCase().trim();
  return getSourceProducts().find((p) => p.slug.toLowerCase() === norm || p.id.toLowerCase() === norm);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getSourceProducts().filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return getSourceProducts().filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return getSourceProducts().filter((p) => p.bestSeller);
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

export function getProductsByArtist(artistSlug: string): Product[] {
  return getSourceProducts().filter((p) => p.artistSlug === artistSlug);
}

export function filterProducts(filters: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Product[] {
  let result = [...getSourceProducts()];

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
  return getSourceProducts()
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}

export function getGiftRecommendations(
  recipient: string,
  budget: number
): Product[] {
  const maxPrice = budget;
  const recipientTags: Record<string, string[]> = {
    friend: ["stickers", "gift", "tote"],
    partner: ["mug", "gift", "print"],
    parent: ["calendar", "decor", "vase"],
    artist: ["journal", "print", "digital"],
    student: ["stickers", "journal", "digital"],
  };

  const tags = recipientTags[recipient] || [];

  return getSourceProducts()
    .filter((p) => p.price <= maxPrice)
    .sort((a, b) => {
      const aMatch = a.tags.some((t) => tags.includes(t)) ? 1 : 0;
      const bMatch = b.tags.some((t) => tags.includes(t)) ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 6);
}
