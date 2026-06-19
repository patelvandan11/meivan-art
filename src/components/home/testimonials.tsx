import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/data/products";

export function TestimonialsSection() {
  return (
    <section className="section-alt py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-accent text-lg italic text-muted-foreground">
            Loved by Creatives
          </p>
          <h2 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            What Our Customers Say
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-card bg-card p-6 shadow-soft"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-terracotta text-terracotta" />
                ))}
              </div>
              <p className="mt-4 font-accent text-lg italic leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.comment}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Purchased {testimonial.product}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
