import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProductsSection } from "@/components/home/featured-products";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

const ArtistStorySection = dynamic(
  () =>
    import("@/components/home/artist-story").then((m) => ({
      default: m.ArtistStorySection,
    })),
  { loading: () => <SectionSkeleton className="h-[600px]" /> }
);

const BestSellersSection = dynamic(
  () =>
    import("@/components/home/best-sellers").then((m) => ({
      default: m.BestSellersSection,
    })),
  { loading: () => <SectionSkeleton className="h-[500px]" /> }
);

const CustomerGallerySection = dynamic(
  () =>
    import("@/components/home/customer-gallery").then((m) => ({
      default: m.CustomerGallerySection,
    })),
  { loading: () => <SectionSkeleton className="h-[800px]" /> }
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/home/testimonials").then((m) => ({
      default: m.TestimonialsSection,
    })),
  { loading: () => <SectionSkeleton className="h-[400px]" /> }
);

const NewsletterSection = dynamic(
  () =>
    import("@/components/home/newsletter").then((m) => ({
      default: m.NewsletterSection,
    })),
  { loading: () => <SectionSkeleton className="h-64" /> }
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ArtistStorySection />
      <BestSellersSection />
      <CustomerGallerySection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
