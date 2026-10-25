import type { Artist, Category, GalleryImage, Product, Testimonial } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-paintings",
    name: "Paintings & Canvas Art",
    slug: "paintings",
    description: "Original handmade acrylic & oil storytelling paintings on gallery-wrapped canvas",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    productCount: 5,
    icon: "🎨",
    type: "art",
  },
  {
    id: "cat-botanical",
    name: "Botanical & Nature Art",
    slug: "botanical-art",
    description: "Hand-painted foliage, emerald leaves, and nature-inspired canvas artwork",
    image: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&q=80",
    productCount: 3,
    icon: "🍃",
    type: "art",
  },
  {
    id: "cat-celestial",
    name: "Sunset & Celestial Horizons",
    slug: "sunsets-celestial",
    description: "Vibrant golden dusk skies, cosmic stardust, and celestial nebula paintings",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    productCount: 3,
    icon: "🌅",
    type: "art",
  },
  {
    id: "cat-prints",
    name: "Fine Art Prints & Sketches",
    slug: "prints-sketches",
    description: "Museum-grade archival cotton prints and detailed fine art sketches",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    productCount: 2,
    icon: "🖼️",
    type: "art",
  },
  {
    id: "cat-journals",
    name: "Art Journals & Sketchbooks",
    slug: "journals",
    description: "Handbound botanical linen sketchbooks and archival artist journals",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
    productCount: 2,
    icon: "📖",
    type: "art",
  },
  {
    id: "cat-digital",
    name: "Digital Art & Coloring Books",
    slug: "digital",
    description: "Printable mindfulness coloring books, high-res wallpapers, and digital art guides",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    productCount: 1,
    icon: "⚡",
    type: "art",
  },
];

export const products: Product[] = [
  // --- 🎨 1. ORIGINAL PAINTINGS & CANVAS ART ---
  {
    id: "art-sunset-serenade-canvas",
    name: "Sunset Serenade — Original Acrylic on Stretched Canvas",
    slug: "sunset-serenade-original-canvas-painting",
    description:
      "A breathtaking original acrylic artwork capturing the tranquil, emotional transition between day and night. Rich ochre, terracotta, violet, and gold hues evoke deep peace and warmth. Painted with textured impasto on museum-grade gallery-wrapped heavyweight cotton canvas (ready to hang). Includes hand-signed Certificate of Authenticity.",
    price: 3499,
    comparePrice: 4999,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    category: "Paintings & Canvas Art",
    categorySlug: "paintings",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 42,
    stock: 3,
    featured: true,
    bestSeller: true,
    trending: true,
    productType: "art",
    tags: ["painting", "original-art", "sunset", "canvas", "handmade", "wall-art", "ochre", "warmth"],
  },
  {
    id: "art-celestial-dreams-galaxy",
    name: "Celestial Dreams — Astronomy & Deep Nebula Canvas",
    slug: "celestial-dreams-astronomy-nebula-canvas",
    description:
      "An otherworldly cosmic visual journey through swirling stardust, glowing interstellar nebulae, and stellar constellations. Handcrafted with textured acrylic impasto and luminescent pigments that gently capture twilight reflections. Stretched over solid pine stretcher bars.",
    price: 4299,
    comparePrice: 5999,
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    ],
    category: "Sunset & Celestial Horizons",
    categorySlug: "sunsets-celestial",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 29,
    stock: 2,
    featured: true,
    bestSeller: false,
    trending: true,
    productType: "art",
    tags: ["painting", "astronomy", "galaxy", "celestial", "night-sky", "cosmic", "stardust"],
  },
  {
    id: "art-golden-hour-reflections",
    name: "Golden Hour Horizon — Warm Oil & Acrylic on Canvas",
    slug: "golden-hour-reflections-canvas",
    description:
      "Inspired by the serene stillness of countryside lakes during the final moments of golden hour. Layered glazing and rich cadmium yellow, vermilion, and burnt sienna brushstrokes bring an ambient, calming glow to any living space or study.",
    price: 3899,
    comparePrice: 5299,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    ],
    category: "Sunset & Celestial Horizons",
    categorySlug: "sunsets-celestial",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 24,
    stock: 2,
    featured: true,
    bestSeller: true,
    trending: false,
    productType: "art",
    tags: ["sunset", "golden-hour", "landscape", "warm", "oil-canvas", "original-art"],
  },
  {
    id: "art-whispering-forest-birch",
    name: "Whispering Birch Forest — Textured Acrylic Canvas",
    slug: "whispering-birch-forest-canvas",
    description:
      "A serene impressionist study of mist-veiled birch groves in early morning light. Knife-textured bark details contrasted against soft watercolor-style emerald gradients create a calming retreat for meditation corners and bedrooms.",
    price: 3699,
    comparePrice: 4899,
    images: [
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    ],
    category: "Paintings & Canvas Art",
    categorySlug: "paintings",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 19,
    stock: 4,
    featured: false,
    bestSeller: true,
    trending: true,
    productType: "art",
    tags: ["forest", "birch", "trees", "nature", "acrylic", "landscape", "canvas"],
  },
  {
    id: "art-coastal-tides-ocean",
    name: "Ocean Mist & Coastal Tides — Original Seascape Canvas",
    slug: "ocean-mist-coastal-tides-canvas",
    description:
      "Feel the rejuvenating rhythm of coastal waters. Thick impasto seafoam rolling over deep sapphire and turquoise ocean depths, accented with subtle golden quartz sands. Finished with protective archival gloss varnish.",
    price: 3999,
    comparePrice: 5499,
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    ],
    category: "Paintings & Canvas Art",
    categorySlug: "paintings",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 35,
    stock: 3,
    featured: true,
    bestSeller: false,
    trending: true,
    productType: "art",
    tags: ["ocean", "waves", "seascape", "blue", "turquoise", "coastal", "canvas"],
  },
  {
    id: "art-mountain-majesty-himalayas",
    name: "Himalayan Morning — Textured Palette Knife Canvas",
    slug: "himalayan-morning-palette-knife-canvas",
    description:
      "Soaring snowcapped peaks catching the first touch of alpine sunlight. Sculpted with bold palette-knife strokes using heavy-body acrylics on 100% pure cotton canvas. A majestic tribute to timeless natural wonders.",
    price: 4599,
    comparePrice: 6299,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    category: "Paintings & Canvas Art",
    categorySlug: "paintings",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 17,
    stock: 2,
    featured: false,
    bestSeller: true,
    trending: false,
    productType: "art",
    tags: ["mountains", "himalayas", "peaks", "palette-knife", "snow", "canvas", "original-art"],
  },

  // --- 🍃 2. BOTANICAL & NATURE ART ---
  {
    id: "art-emerald-whispers-botanical",
    name: "Emerald Whispers — Botanical Foliage & Leaf Art Canvas",
    slug: "emerald-whispers-botanical-foliage-art",
    description:
      "A tribute to the quiet vitality of ancient rainforests. Fine textured layered brushstrokes highlight Monstera and Palm fronds against an earthy stone background. Brings lush, organic botanical serenity into any modern home or office.",
    price: 2899,
    comparePrice: 3899,
    images: [
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&q=80",
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80",
    ],
    category: "Botanical & Nature Art",
    categorySlug: "botanical-art",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 28,
    stock: 5,
    featured: true,
    bestSeller: true,
    trending: true,
    productType: "art",
    tags: ["botanical", "foliage", "leaf-art", "nature", "green-decor", "canvas", "monstera"],
  },
  {
    id: "art-eucalyptus-minimalist",
    name: "Eucalyptus Breeze — Minimalist Botanical Watercolor & Ink",
    slug: "eucalyptus-breeze-minimalist-botanical",
    description:
      "Graceful curving eucalyptus branches rendered in muted sage, olive, and warm charcoal line work. Framed in clean natural pine wood, ready to bring gentle understated Nordic minimalism to hallways and bedrooms.",
    price: 2199,
    comparePrice: 2899,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&q=80",
    ],
    category: "Botanical & Nature Art",
    categorySlug: "botanical-art",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.8,
    reviewCount: 22,
    stock: 6,
    featured: false,
    bestSeller: false,
    trending: true,
    productType: "art",
    tags: ["botanical", "eucalyptus", "minimalist", "watercolor", "ink", "sage"],
  },
  {
    id: "art-sunflower-radiance",
    name: "Sunflower Radiance — Textured Impressionist Canvas",
    slug: "sunflower-radiance-impressionist-canvas",
    description:
      "A burst of vibrant amber, gold, and terracotta sunshine. Inspired by Mediterranean summer fields, this original impressionist canvas is crafted with dynamic rhythmic brushwork that uplifts every room.",
    price: 3299,
    comparePrice: 4499,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    category: "Botanical & Nature Art",
    categorySlug: "botanical-art",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 31,
    stock: 4,
    featured: true,
    bestSeller: true,
    trending: false,
    productType: "art",
    tags: ["botanical", "sunflower", "yellow", "gold", "floral", "impressionist", "canvas"],
  },

  // --- 🖼️ 3. FINE ART PRINTS & SKETCHES ---
  {
    id: "art-cosmic-horizons-print",
    name: "Cosmic Horizons — Limited Edition Archival Fine Art Print",
    slug: "cosmic-horizons-archival-fine-art-print",
    description:
      "Museum-quality Giclée reproduction of Vandan's signature astronomy painting on 310 GSM archival cotton rag paper. Hand-numbered, signed by the artist, and embossed with the studio seal. Rated for 100+ years lightfastness.",
    price: 1499,
    comparePrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    category: "Fine Art Prints & Sketches",
    categorySlug: "prints-sketches",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 26,
    stock: 15,
    featured: true,
    bestSeller: false,
    trending: true,
    productType: "art",
    tags: ["fine-art-print", "giclee", "archival", "cotton-rag", "signed", "limited-edition"],
  },
  {
    id: "art-solitude-tree-ink-sketch",
    name: "The Solitude Tree — Fine Ink & Graphite Original Sketch",
    slug: "solitude-tree-ink-graphite-sketch",
    description:
      "An evocative ink stippling and graphite study of an ancient banyan silhouette against open negative space. Double-matted in archival acid-free museum board and shipped ready for standard framing.",
    price: 1899,
    comparePrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
    ],
    category: "Fine Art Prints & Sketches",
    categorySlug: "prints-sketches",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 14,
    stock: 3,
    featured: false,
    bestSeller: false,
    trending: false,
    productType: "art",
    tags: ["sketch", "ink", "graphite", "tree", "banyan", "drawing", "monochrome"],
  },

  // --- 📖 4. ART JOURNALS & SKETCHBOOKS ---
  {
    id: "journal-botanical-linen-sketchbook",
    name: "Handbound Botanical Linen Art Journal & Sketchbook",
    slug: "handbound-botanical-linen-journal",
    description:
      "Hand-sewn with 100% natural unbleached cotton deckle paper (200 GSM, fountain-pen, ink, and gouache/watercolor friendly). Bound in raw natural linen with a hand-pressed fern botanical seal. Lay-flat binding designed for creators, poets, and visual journalers.",
    price: 899,
    comparePrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
      "https://images.unsplash.com/photo-1455393573742-b8f9b43e46cd?w=800&q=80",
    ],
    category: "Art Journals & Sketchbooks",
    categorySlug: "journals",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 38,
    stock: 20,
    featured: true,
    bestSeller: true,
    trending: true,
    productType: "art",
    tags: ["journal", "sketchbook", "handbound", "botanical", "linen", "watercolor-paper", "stationery"],
  },
  {
    id: "journal-celestial-leather-sketchbook",
    name: "Constellation Handbound Leather Artist Journal",
    slug: "constellation-leather-artist-journal",
    description:
      "Crafted with supple distressed vegetable-tanned leather embossed with vintage astronomical constellations. Features 180 pages of handmade recycled cotton deckled paper that welcomes ink, acrylic washes, and personal reflections.",
    price: 1299,
    comparePrice: 1799,
    images: [
      "https://images.unsplash.com/photo-1455393573742-b8f9b43e46cd?w=800&q=80",
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
    ],
    category: "Art Journals & Sketchbooks",
    categorySlug: "journals",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 27,
    stock: 14,
    featured: false,
    bestSeller: true,
    trending: false,
    productType: "art",
    tags: ["journal", "leather", "sketchbook", "constellation", "vintage", "handmade"],
  },

  // --- ⚡ 5. DIGITAL ART & COLORING BOOKS ---
  {
    id: "digital-animal-coloring-book",
    name: "Animal & Botanical Mindfulness Coloring Book (50 Pages Printable PDF)",
    slug: "animal-coloring-book",
    description:
      "A beautifully illustrated 50-page printable animal & botanical coloring book designed for relaxation, creative mindfulness, and meditative focus. Ultra high-resolution 300 DPI PDF format ready for instant download and home printing on standard A4 / US Letter paper.",
    price: 299,
    comparePrice: 499,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    ],
    category: "Digital Art & Coloring Books",
    categorySlug: "digital",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 34,
    stock: 999,
    featured: false,
    bestSeller: true,
    trending: false,
    productType: "art",
    isDigital: true,
    storagePath: "animal-coloring-book-by-meivan-art.pdf.pdf",
    storage_path: "animal-coloring-book-by-meivan-art.pdf.pdf",
    tags: ["coloring", "digital", "pdf", "book", "art", "mindfulness", "printable"],
  },
];

export const artists: Artist[] = [
  {
    id: "art-1",
    name: "Vandan Patel",
    slug: "vandan-patel",
    bio: "Visual artist and landscape painter based in India. Exploring deep emotions, tranquil sunsets, celestial skies, and botanical serenity through textured impasto and original handmade canvas storytelling.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    specialty: "Original Acrylic & Oil Canvases, Sunsets & Cosmic Art",
    location: "India",
    productCount: 12,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aanya Sharma",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    product: "Sunset Serenade Original Canvas Painting",
    rating: 5,
    comment:
      "I booked my order directly on WhatsApp and the artist sent me photos and video clips of the painting before shipping! It arrived in a reinforced art crate in 3 days. The colors and brush textures are truly magnificent.",
  },
  {
    id: "t2",
    name: "Rohan Verma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    product: "Celestial Dreams — Astronomy & Deep Nebula Canvas",
    rating: 5,
    comment:
      "The nebula depth and stardust textures look ethereal in evening light. Ordering via WhatsApp was seamless — quick reply, UPI payment, and instant tracking. 10/10 recommendation for art lovers!",
  },
  {
    id: "t3",
    name: "Pooja Mehta",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    product: "Emerald Whispers Botanical Foliage Canvas",
    rating: 5,
    comment:
      "The organic greens and detailed leaf layers look stunning above our living room sofa. Knowing that it's 100% hand-painted by the artist makes it so special.",
  },
  {
    id: "t4",
    name: "Devendra Joshi",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    product: "Handbound Botanical Linen Sketchbook",
    rating: 5,
    comment:
      "The paper quality is unmatched — heavy 200 GSM cotton that handles wet watercolor washes effortlessly without warping. Gorgeous handmade binding.",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
    alt: "Sunset Serenade original canvas artwork in minimalist living room",
    user: "@artfulhome",
    height: 380,
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    alt: "Celestial Dreams cosmic painting displayed in ambient creative studio",
    user: "@studiovibes",
    height: 440,
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&q=80",
    alt: "Emerald foliage botanical canvas on warm neutral wall",
    user: "@botanicalartspace",
    height: 340,
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80",
    alt: "Artist workdesk with handmade linen journal and painting tools",
    user: "@creativesoul",
    height: 400,
  },
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
    friend: ["print", "journal", "sunset"],
    partner: ["sunset", "galaxy", "original-art"],
    parent: ["landscape", "canvas", "botanical"],
    artist: ["journal", "sketchbook", "digital"],
    student: ["digital", "journal", "sketch"],
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
