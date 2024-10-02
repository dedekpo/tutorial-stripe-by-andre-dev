"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

export default function BuyButton() {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  async function handleClick(testeId: string, assinatura: boolean) {
    try {
      setIsCreatingCheckout(true);
      const checkoutResponse = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assinatura, testeId }),
      });

      const stripeClient = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUB_KEY as string
      );

      if (!stripeClient) throw new Error("Stripe failed to initialize.");

      const { sessionId } = await checkoutResponse.json();
      await stripeClient.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingCheckout(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        disabled={isCreatingCheckout}
        className="border rounded-md px-4 py-2 disabled:opacity-50"
        onClick={() => handleClick("123", false)}
      >
        comprar
      </button>
      <button
        disabled={isCreatingCheckout}
        className="border rounded-md px-4 py-2 disabled:opacity-50"
        onClick={() => handleClick("123", true)}
      >
        assinar
      </button>
    </div>
  );
}
