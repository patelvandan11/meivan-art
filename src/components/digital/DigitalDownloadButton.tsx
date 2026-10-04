"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalDownloadButtonProps {
  orderId: string;
  productId: string;
  productName: string;
  storagePath?: string;
  isPaid?: boolean;
}

export function DigitalDownloadButton({
  orderId,
  productId,
  productName,
  storagePath,
  isPaid = true,
}: DigitalDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  if (!storagePath) {
    return null;
  }

  const isExternalUrl = storagePath.startsWith("http://") || storagePath.startsWith("https://");

  const handleGenerateDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/digital/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.downloadUrl) {
        throw new Error(data.error || "Unable to access digital product link.");
      }

      setDownloadUrl(data.downloadUrl);
      if (data.expiresAt) {
        const date = new Date(data.expiresAt);
        setExpiresAt(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }

      // Directly open/redirect to the digital product URL page in a new tab
      window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to access digital product";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/30 p-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full mb-1">
              Digital Product Included
            </span>
            <h4 className="text-sm font-bold text-foreground">{productName}</h4>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate max-w-[280px]">
              {storagePath}
            </p>
          </div>
        </div>

        <div className="self-end sm:self-auto shrink-0">
          <Button
            onClick={handleGenerateDownload}
            disabled={loading || !isPaid}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-soft font-semibold"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening Link...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {isExternalUrl ? "Access Digital Link" : "Download PDF"}
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-100 p-2.5 text-xs text-red-800 dark:bg-red-950/60 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {downloadUrl && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-emerald-100 p-2.5 text-xs text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Redirected to digital product page!</span>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-emerald-950"
            >
              Click here if tab didn&apos;t open automatically
            </a>
          </div>
          {expiresAt && (
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
              (Link valid until {expiresAt})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
