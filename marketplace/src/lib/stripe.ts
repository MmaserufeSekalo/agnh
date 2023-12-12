import Stripe from "Stripe";

export const Stripe = new Stripe(process.env.PAYSTACK_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});
