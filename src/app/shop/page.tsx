import { Suspense } from "react";
import { ShopContent } from "./shop-content";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
