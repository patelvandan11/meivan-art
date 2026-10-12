import type { Artist, Category, GalleryImage, Product, Testimonial } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-paintings",
    name: "Paintings & Canvas Art",
    slug: "paintings",
    description: "Original handmade acrylic & canvas storytelling paintings",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    productCount: 4,
    icon: "🎨",
    type: "art",
  },
  {
    id: "cat-plants",
    name: "Indoor & Air-Purifying Plants",
    slug: "indoor-plants",
    description: "Healthy live house plants that purify your air and uplift your space",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80",
    productCount: 5,
    icon: "🌿",
    type: "plant",
  },
  {
    id: "cat-planters",
    name: "Hand-Painted Planters & Pots",
    slug: "planters",
    description: "Artisan terracotta & ceramic pots hand-painted with sunset & botanical motifs",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    productCount: 3,
    icon: "🏺",
    type: "plant",
  },
  {
    id: "cat-bundles",
    name: "Art & Plant Bundles",
    slug: "plant-art-bundles",
    description: "Curated harmonious pairings of original paintings and living plants",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
    productCount: 2,
    icon: "🎁",
    type: "both",
  },
  {
    id: "cat-succulents",
    name: "Succulents & Desk Greens",
    slug: "succulents",
    description: "Resilient, low-maintenance tabletop plants and desktop greens",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
    productCount: 3,
    icon: "🌵",
    type: "plant",
  },
  {
    id: "cat-botanical",
    name: "Botanical Art & Prints",
    slug: "botanical-art",
    description: "Nature-inspired canvas wall art, foliage prints, and floral stories",
    image: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&q=80",
    productCount: 3,
    icon: "🍃",
    type: "art",
  },
  {
    id: "cat-mugs",
    name: "Artisan Ceramic Mugs",
    slug: "mugs",
    description: "Handcrafted mugs, tumblers, and artisan tea sets",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    productCount: 2,
    icon: "☕",
    type: "art",
  },
  {
    id: "cat-journals",
    name: "Handbound Journals",
    slug: "journals",
    description: "Botanical linen sketchbooks and handbound nature journals",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
    productCount: 2,
    icon: "📖",
    type: "art",
  },
  {
    id: "cat-digital",
    name: "Digital Downloads & Care Guides",
    slug: "digital",
    description: "Printable coloring books, phone wallpapers, and indoor plant care e-books",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    productCount: 1,
    icon: "⚡",
    type: "both",
  },
];

export const products: Product[] = [
  // --- 🌿 LIVE PLANTS & GREENS ---
  {
    id: "plant-monstera-deliciosa",
    name: "Monstera Deliciosa (Swiss Cheese Plant) in Artisan Pot",
    slug: "monstera-deliciosa-artisan-pot",
    description:
      "A lush, thriving Swiss Cheese Plant (Monstera Deliciosa) with signature split leaves. Known as the ultimate indoor statement plant that purifies air and brings tropical energy to your living room or studio. Potted in a breathable artisan planter with organic nutrient-rich soil.",
    price: 1199,
    comparePrice: 1599,
    images: [
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80",
      "https://images.unsplash.com/photo-1525498128493-380d1990a112?w=800&q=80",
      "https://images.unsplash.com/photo-1597055181300-e3633a207518?w=800&q=80",
    ],
    category: "Indoor & Air-Purifying Plants",
    categorySlug: "indoor-plants",
    artist: "Vandan Studio Greenery",
    artistSlug: "vandan-plants",
    rating: 4.9,
    reviewCount: 38,
    stock: 15,
    featured: true,
    bestSeller: true,
    trending: true,
    productType: "plant",
    plantCare: {
      light: "Bright Indirect Sunlight",
      water: "Water when top 2 inches dry (Weekly)",
      difficulty: "Beginner Friendly",
      airPurifying: true,
      petFriendly: false,
      potIncluded: true,
    },
    tags: ["plant", "indoor-plants", "monstera", "air-purifying", "lush", "green"],
  },
  {
    id: "plant-snake-plant-sansevieria",
    name: "Variegated Snake Plant (Sansevieria Laurentii) — Hard to Kill",
    slug: "variegated-snake-plant-sansevieria",
    description:
      "The undisputed champion of oxygen-producing bedroom plants. NASA-certified to filter airborne toxins day and night. Features upright sword-like leaves with striking golden-yellow margins. Thrives on minimal attention and tolerates low-light environments effortlessly.",
    price: 799,
    comparePrice: 1099,
    images: [
      "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&q=80",
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
    ],
    category: "Indoor & Air-Purifying Plants",
    categorySlug: "indoor-plants",
    artist: "Vandan Studio Greenery",
    artistSlug: "vandan-plants",
    rating: 5.0,
    reviewCount: 52,
    stock: 22,
    featured: true,
    bestSeller: true,
    trending: false,
    productType: "plant",
    plantCare: {
      light: "Low to Bright Indirect Light",
      water: "Once every 2-3 Weeks (drought tolerant)",
      difficulty: "Hard to Kill",
      airPurifying: true,
      petFriendly: false,
      potIncluded: true,
    },
    tags: ["plant", "snake-plant", "sansevieria", "low-maintenance", "air-purifying", "bedroom"],
  },
  {
    id: "plant-peace-lily-blooming",
    name: "Peace Lily (Spathiphyllum) with White Blooms",
    slug: "peace-lily-blooming-indoor-plant",
    description:
      "An elegant indoor plant featuring deep glossy emerald foliage and graceful white spathes. Peace Lilies communicate clearly by nodding slightly when thirsty, making them a joyful, communicative green companion for calm and focused corners.",
    price: 949,
    comparePrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    ],
    category: "Indoor & Air-Purifying Plants",
    categorySlug: "indoor-plants",
    artist: "Vandan Studio Greenery",
    artistSlug: "vandan-plants",
    rating: 4.8,
    reviewCount: 29,
    stock: 12,
    featured: false,
    bestSeller: true,
    trending: true,
    productType: "plant",
    plantCare: {
      light: "Medium to Low Filtered Light",
      water: "Weekly, loves moderate humidity",
      difficulty: "Easy",
      airPurifying: true,
      petFriendly: false,
      potIncluded: true,
    },
    tags: ["plant", "peace-lily", "blooming", "indoor", "air-purifying", "living-room"],
  },
  {
    id: "plant-golden-pothos-trailing",
    name: "Golden Pothos Trailing Vine in Hand-Painted Pot",
    slug: "golden-pothos-trailing-vine-pot",
    description:
      "A cheerful, fast-growing trailing vine with marbled green and yellow heart-shaped leaves. Looks stunning cascading from bookshelves, floating plant hangers, or desktop corners. Shipped in a custom hand-painted terracotta planter.",
    price: 849,
    comparePrice: 1199,
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
    ],
    category: "Indoor & Air-Purifying Plants",
    categorySlug: "indoor-plants",
    artist: "Vandan Studio Greenery",
    artistSlug: "vandan-plants",
    rating: 4.9,
    reviewCount: 44,
    stock: 18,
    featured: true,
    bestSeller: false,
    trending: true,
    productType: "plant",
    plantCare: {
      light: "Moderate to Bright Indirect",
      water: "When topsoil dries out (7-9 days)",
      difficulty: "Beginner Friendly",
      airPurifying: true,
      petFriendly: false,
      potIncluded: true,
    },
    tags: ["plant", "pothos", "trailing", "hanging-plant", "hand-painted-pot"],
  },
  {
    id: "plant-jade-bonsai-succulent",
    name: "Crassula Ovata (Jade Plant) — The Prosperity Bonsai",
    slug: "jade-plant-bonsai-prosperity-succulent",
    description:
      "Regarded in Feng Shui as the symbol of prosperity, luck, and positive energy. Features fleshy, coin-shaped jade green leaves growing on miniature tree-like woody stems. Extremely resilient and perfect for study tables and creative workstations.",
    price: 699,
    comparePrice: 899,
    images: [
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
      "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80",
    ],
    category: "Succulents & Desk Greens",
    categorySlug: "succulents",
    artist: "Vandan Studio Greenery",
    artistSlug: "vandan-plants",
    rating: 4.9,
    reviewCount: 33,
    stock: 25,
    featured: false,
    bestSeller: true,
    trending: false,
    productType: "plant",
    plantCare: {
      light: "Bright Direct to Indirect Light",
      water: "Every 10-14 days (Do not overwater)",
      difficulty: "Very Easy",
      airPurifying: false,
      petFriendly: false,
      potIncluded: true,
    },
    tags: ["succulent", "jade", "bonsai", "desk-plant", "luck", "green"],
  },

  // --- 🏺 HAND-PAINTED PLANTERS & POTS ---
  {
    id: "planter-sunset-horizon-terracotta",
    name: "Sunset Horizon — Hand-Painted Terracotta Planter (6-inch)",
    slug: "sunset-horizon-hand-painted-planter",
    description:
      "Individually hand-painted by artist Vandan with warm gradient acrylics depicting glowing dusk skies and mountain silhouettes. Crafted from breathable, natural earthenware with built-in drainage holes to keep plant roots healthy and aerated.",
    price: 649,
    comparePrice: 849,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    category: "Hand-Painted Planters & Pots",
    categorySlug: "planters",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 21,
    stock: 14,
    featured: true,
    bestSeller: true,
    trending: true,
    productType: "planter",
    tags: ["planter", "hand-painted", "pot", "terracotta", "sunset", "artisan"],
  },
  {
    id: "planter-botanical-fern-ceramic",
    name: "Fern Whisper — Hand-Glazed Ceramic Plant Pot (7-inch)",
    slug: "fern-whisper-hand-glazed-ceramic-pot",
    description:
      "Hand-thrown high-fired stoneware pot painted with delicate botanical fern fronds in deep sage and forest green underglazes. Sealed with a protective matte coat suitable for indoor or patio display.",
    price: 899,
    comparePrice: 1199,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    category: "Hand-Painted Planters & Pots",
    categorySlug: "planters",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 16,
    stock: 10,
    featured: false,
    bestSeller: false,
    trending: true,
    productType: "planter",
    tags: ["planter", "ceramic", "fern", "botanical", "glazed-pot"],
  },

  // --- 🎁 ART & PLANT COMBO BUNDLES ---
  {
    id: "bundle-zen-corner-art-and-plant",
    name: "The Zen Corner Bundle: Sunset Canvas + Monstera in Painted Pot",
    slug: "zen-corner-sunset-canvas-monstera-bundle",
    description:
      "The ultimate sanctuary starter kit. Includes: 1) Original Sunset Serenade stretched canvas painting (12x16 inch), 2) Healthy live Monstera Deliciosa plant, and 3) Custom hand-painted terracotta planter. Turn any room into an inspiring botanical gallery in seconds.",
    price: 4299,
    comparePrice: 5999,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80",
    ],
    category: "Art & Plant Bundles",
    categorySlug: "plant-art-bundles",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 19,
    stock: 8,
    featured: true,
    bestSeller: true,
    trending: true,
    productType: "bundle",
    plantCare: {
      light: "Bright Indirect Light",
      water: "Weekly",
      difficulty: "Beginner Friendly",
      airPurifying: true,
      potIncluded: true,
    },
    tags: ["bundle", "combo", "art-and-plant", "painting", "monstera", "gift-set", "bestseller"],
  },
  {
    id: "bundle-desk-haven-succulent-art",
    name: "Creative Desk Haven: Botanical Mini Canvas + Jade Plant Set",
    slug: "creative-desk-haven-mini-canvas-jade-set",
    description:
      "Designed specifically for work desks and cozy bookshelves. Includes an 8x8 inch original acrylic botanical fern miniature on wood easel paired with a potted Jade Plant in an artisan ceramic pot. The perfect mindful gift for yourself or loved ones.",
    price: 1899,
    comparePrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
    ],
    category: "Art & Plant Bundles",
    categorySlug: "plant-art-bundles",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 23,
    stock: 12,
    featured: false,
    bestSeller: true,
    trending: true,
    productType: "bundle",
    tags: ["bundle", "desk", "mini-art", "succulent", "gift", "workstation"],
  },

  // --- 🎨 ORIGINAL PAINTINGS & FINE ART ---
  {
    id: "art-sunset-serenade-canvas",
    name: "Sunset Serenade — Original Acrylic on Canvas",
    slug: "sunset-serenade-original-canvas-painting",
    description:
      "A breathtaking original acrylic artwork capturing the tranquil, emotional transition between day and night. Rich ochre, terracotta, violet, and gold hues evoke deep peace and warmth. Painted on gallery-wrapped heavyweight cotton canvas, ready to hang.",
    price: 3499,
    comparePrice: 4999,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    ],
    category: "Paintings & Canvas Art",
    categorySlug: "paintings",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 41,
    stock: 3,
    featured: true,
    bestSeller: true,
    trending: true,
    productType: "art",
    tags: ["painting", "original-art", "sunset", "canvas", "handmade", "wall-art"],
  },
  {
    id: "art-celestial-dreams-galaxy",
    name: "Celestial Dreams — Astronomy & Deep Nebula Canvas",
    slug: "celestial-dreams-astronomy-nebula-canvas",
    description:
      "An otherworldly cosmic visual journey through swirling stardust, glowing nebulae, and stellar constellations. Handcrafted with textured acrylic impasto and luminescent pigments that gently illuminate in ambient twilight.",
    price: 4299,
    comparePrice: 5999,
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    ],
    category: "Paintings & Canvas Art",
    categorySlug: "paintings",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 27,
    stock: 2,
    featured: true,
    bestSeller: false,
    trending: true,
    productType: "art",
    tags: ["painting", "astronomy", "galaxy", "celestial", "night-sky", "cosmic"],
  },
  {
    id: "art-botanical-foliage-canvas",
    name: "Emerald Whispers — Botanical Foliage & Leaf Art",
    slug: "emerald-whispers-botanical-foliage-art",
    description:
      "A tribute to the quiet vitality of ancient rainforests. Fine textured layered brushstrokes highlight Monstera and Palm fronds against an earthy stone background. Complements living indoor houseplants with aesthetic grace.",
    price: 2899,
    comparePrice: 3899,
    images: [
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&q=80",
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80",
    ],
    category: "Botanical Art & Prints",
    categorySlug: "botanical-art",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 18,
    stock: 5,
    featured: false,
    bestSeller: true,
    trending: false,
    productType: "art",
    tags: ["botanical", "foliage", "leaf-art", "nature", "green-decor", "canvas"],
  },

  // --- 📖 HANDBOUND JOURNALS & CERAMICS ---
  {
    id: "merch-botanical-linen-journal",
    name: "Handbound Botanical Linen Sketchbook & Journal",
    slug: "handbound-botanical-linen-journal",
    description:
      "Hand-sewn with 100% natural unbleached cotton paper (180 GSM, fountain-pen and watercolor friendly) wrapped in archival linen fabric featuring a hand-pressed fern motif. Built for mindful journaling, plant tracking, and sketching.",
    price: 899,
    comparePrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
      "https://images.unsplash.com/photo-1455393573742-b8f9b43e46cd?w=800&q=80",
    ],
    category: "Handbound Journals",
    categorySlug: "journals",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 4.9,
    reviewCount: 31,
    stock: 20,
    featured: false,
    bestSeller: false,
    trending: false,
    productType: "merch",
    tags: ["journal", "sketchbook", "handbound", "botanical", "stationery"],
  },

  // --- ⚡ DIGITAL PRODUCTS ---
  {
    id: "digital-animal-coloring-book",
    name: "Animal & Botanical Mindfulness Coloring Book (50 Pages Printable PDF)",
    slug: "animal-coloring-book",
    description:
      "A beautifully illustrated 50-page printable animal & botanical coloring book for relaxation, mindfulness, and creative expression. High-resolution PDF format ready for instant download and home printing.",
    price: 299,
    comparePrice: 499,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    ],
    category: "Digital Downloads & Care Guides",
    categorySlug: "digital",
    artist: "Vandan Patel",
    artistSlug: "vandan-patel",
    rating: 5.0,
    reviewCount: 28,
    stock: 999,
    featured: false,
    bestSeller: true,
    trending: false,
    productType: "merch",
    isDigital: true,
    storagePath: "animal-coloring-book-by-meivan-art.pdf.pdf",
    storage_path: "animal-coloring-book-by-meivan-art.pdf.pdf",
    tags: ["coloring", "digital", "pdf", "book", "art", "botanical"],
  },
];

export const artists: Artist[] = [
  {
    id: "art-1",
    name: "Vandan Patel",
    slug: "vandan-patel",
    bio: "Visual artist, landscape painter, and botanist exploring the intersections between heartfelt storytelling on canvas and living indoor greenery.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    specialty: "Acrylic Storytelling, Sunset Canvases & Hand-Painted Pots",
    location: "India",
    productCount: 8,
  },
  {
    id: "art-2",
    name: "Vandan Studio Greenery",
    slug: "vandan-plants",
    bio: "Passionate nursery horticulturists carefully propagating healthy, acclimated houseplants suited for indoor spaces, desks, and bright living rooms.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    specialty: "Air-Purifying Houseplants & Botanical Living Sculptures",
    location: "India",
    productCount: 6,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aanya Sharma",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    product: "The Zen Corner Art & Plant Bundle",
    rating: 5,
    comment:
      "I was skeptical about ordering a live plant online, but the Monstera arrived in pristine condition with lush green leaves, and the sunset canvas tied my whole living room together! Beyond thrilled.",
  },
  {
    id: "t2",
    name: "Rohan Verma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    product: "Variegated Snake Plant in Hand-Painted Pot",
    rating: 5,
    comment:
      "The hand-painted terracotta pot is a pure work of art. The snake plant is thriving on my study desk with zero fuss. Incredible craftsmanship and secure eco-friendly packaging!",
  },
  {
    id: "t3",
    name: "Pooja Mehta",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    product: "Sunset Serenade Original Canvas Painting",
    rating: 5,
    comment:
      "The colors are even more mesmerizing in real life! The texture, emotional warmth, and details speak volumes. It gives our home such a calming, artistic energy.",
  },
  {
    id: "t4",
    name: "Devendra Joshi",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    product: "Crassula Jade Plant Bonsai",
    rating: 5,
    comment:
      "Great size, healthy roots, and the hand-glazed pot looks very premium on my work desk. 10/10 recommendation for plant parents and art lovers alike!",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
    alt: "Living room with sunset canvas and lush potted indoor plants",
    user: "@botanicalhome",
    height: 340,
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
    alt: "Artisan plant pots paired with original paintings",
    user: "@artandfoliage",
    height: 420,
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80",
    alt: "Monstera Deliciosa thriving beside artistic canvas",
    user: "@plantlover_co",
    height: 300,
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80",
    alt: "Creative studio desk with jade succulent and handbound journal",
    user: "@creativedesk",
    height: 380,
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
