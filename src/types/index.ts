export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  artist?: string;
  artistSlug?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image: string;
  coverImage?: string;
  specialty: string;
  location?: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  product: string;
  rating: number;
  comment: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  user: string;
  height: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: SortOption;
}

export interface GiftFinderAnswers {
  recipient: "friend" | "partner" | "parent" | "artist" | "student";
  budget: 500 | 1000 | 2000 | 5000;
}

export type UserRole = "user" | "artist" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  artistSlug?: string;
}

export interface UserAlbum {
  id: string;
  name: string;
  productIds: string[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  artistSlug?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  cost: number;
  profit: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: string;
}

export interface MonthlySales {
  month: string;
  orders: number;
  revenue: number;
  profit: number;
}
