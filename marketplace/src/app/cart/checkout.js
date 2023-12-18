"use client";

// pages/checkout.js
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/router";
import PayButton from "../components/PaystackButton";


const CheckoutPage = () => {
  
  const router = useRouter();

  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) router.push(url);
      },
    });

  const productIds = items.map(({ product }) => product.id);

  const cartTotal = items.reduce(
    (total, { product }) => total + (product.price - (product.price * (product.discount / 100))),
    0
  );

  const fee = 80;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Set default values for email, name, and phone based on your authentication or user data
    // Example: const user = getCurrentUser(); setEmail(user.email); setName(user.name); setPhone(user.phone);
  }, []);

  return (
    <div className="bg-white">
      {/* ... (same as your existing code) */}

      <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:px-8">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

        {/* ... (same as your existing code) */}

        <div className="mt-6">
          <Button
            disabled={items.length === 0 || isLoading}
            onClick={() => createCheckoutSession({ productIds })}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Processing..." : "Checkout"}
          </Button>
        </div>
      </section>

      {/* Paystack integration */}
      <div className="checkout-form">
        <form>
          <label>Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Phone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </form>
        <PayButton
          email={email}
          amount={cartTotal + fee}
          name={name}
          phone={phone}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
