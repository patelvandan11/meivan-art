import Link from "next/link";
import { Gift, Home, Sticker, Calendar, Sparkles } from "lucide-react";

const aiTools = [
  {
    href: "/ai/gift-finder",
    icon: Gift,
    title: "AI Gift Finder",
    description: "Answer a few questions and get personalized gift suggestions.",
  },
  {
    href: "/ai/room-decor",
    icon: Home,
    title: "Room Decor Assistant",
    description: "Upload a room photo and get matching art and decor recommendations.",
  },
  {
    href: "/ai/sticker-generator",
    icon: Sticker,
    title: "AI Sticker Generator",
    description: "Describe your dream sticker and watch AI bring it to life.",
  },
  {
    href: "/ai/calendar-creator",
    icon: Calendar,
    title: "AI Calendar Creator",
    description: "Upload photos and create a personalized artistic calendar.",
  },
];

export default function AIToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <Sparkles className="mx-auto h-8 w-8 text-terracotta" />
        <h1 className="mt-4 font-heading text-4xl font-semibold md:text-5xl">
          AI-Powered Tools
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Enhance your shopping experience with intelligent recommendations and
          creative tools powered by AI.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {aiTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-card bg-card p-8 shadow-soft transition-all hover:shadow-soft-lg hover:-translate-y-1"
          >
            <tool.icon className="h-8 w-8 text-terracotta" />
            <h2 className="mt-4 font-heading text-xl font-semibold group-hover:text-terracotta transition-colors">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
