import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-sage" />
      <h1 className="mt-6 font-heading text-3xl font-semibold">Order Confirmed!</h1>
      <p className="mt-3 text-muted-foreground">
        Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
      </p>
      <Link href="/shop" className="mt-8 inline-block">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}
