"use client";

import { useState } from "react";
import { MessageCircle, X, Sparkles, Send } from "lucide-react";
import { getWhatsAppUrl, buildGeneralInquiryWhatsAppMessage } from "@/lib/whatsapp";

export function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");

  const handleOpenWhatsApp = (customTopic?: string) => {
    const text = quickMessage.trim() || buildGeneralInquiryWhatsAppMessage(customTopic);
    const url = getWhatsAppUrl(text);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setQuickMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs">
                <MessageCircle className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-semibold text-foreground">
                  Vandan Artwork Studio
                </h4>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Replies quickly on WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Have questions about a painting, custom sizing, or want to book an order directly?
          </p>

          <div className="mt-3 flex flex-col gap-1.5">
            <button
              onClick={() => handleOpenWhatsApp("Original Paintings")}
              className="text-left rounded-xl bg-secondary/60 hover:bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors flex items-center justify-between"
            >
              <span>🎨 Inquire About Original Paintings</span>
              <span className="text-[10px] text-muted-foreground">Ask &rarr;</span>
            </button>
            <button
              onClick={() => handleOpenWhatsApp("Custom Canvas Commission")}
              className="text-left rounded-xl bg-secondary/60 hover:bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors flex items-center justify-between"
            >
              <span>✨ Custom Canvas Commission</span>
              <span className="text-[10px] text-muted-foreground">Request &rarr;</span>
            </button>
            <button
              onClick={() => handleOpenWhatsApp("Order Tracking & Delivery")}
              className="text-left rounded-xl bg-secondary/60 hover:bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors flex items-center justify-between"
            >
              <span>🚚 Track Order / Delivery Status</span>
              <span className="text-[10px] text-muted-foreground">Help &rarr;</span>
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleOpenWhatsApp();
              }}
              className="flex-1 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
            />
            <button
              onClick={() => handleOpenWhatsApp()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors shadow-xs"
              aria-label="Send message on WhatsApp"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="Order or Chat on WhatsApp"
        title="Book Order or Chat via WhatsApp"
      >
        <MessageCircle className="h-7 w-7 fill-current" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
        </span>
      </button>
    </div>
  );
}
