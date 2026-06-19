"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarCreatorPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f));
      setPhotos((prev) => [...prev, ...urls].slice(0, 12));
    }
  }

  async function handleGenerate() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerated(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <Calendar className="mx-auto h-8 w-8 text-terracotta" />
        <h1 className="mt-4 font-heading text-4xl font-semibold">AI Calendar Creator</h1>
        <p className="mt-3 text-muted-foreground">
          Upload your personal photos and create a beautiful personalized calendar.
        </p>
      </div>

      <div className="mt-12">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-border bg-secondary/30 p-12 transition-colors hover:border-terracotta/50">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">Upload your photos</p>
          <p className="text-sm text-muted-foreground">Up to 12 photos for each month</p>
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>

        {photos.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {photos.map((url, i) => (
              <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg">
                <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
        )}

        {photos.length > 0 && !generated && (
          <div className="mt-8 text-center">
            <Button onClick={handleGenerate} disabled={loading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Creating calendar..." : "Generate Calendar"}
            </Button>
          </div>
        )}
      </div>

      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16"
        >
          <h2 className="font-heading text-2xl font-semibold text-center">Your 2026 Calendar</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {months.map((month, i) => (
              <div key={month} className="overflow-hidden rounded-card bg-card shadow-soft">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photos[i % photos.length] || "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&q=80"}
                    alt={month}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/60 to-transparent" />
                  <p className="absolute bottom-3 left-3 font-heading text-lg font-semibold text-white">
                    {month}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button>Download Calendar PDF</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
