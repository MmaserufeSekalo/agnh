import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
//imports for payfast
import express from 'express';
import { createPaymentUrl } from './payfast'; // Assumed helper to create PayFast URL
import { v4 as uuidv4 } from 'uuid'; // For unique session IDs

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async({ ctx, input }) => {
      const { user } = ctx;
      let { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });
//create a filter for products in the order based on info from payload, products paid
const filteredProducts = products.filter((prod) => Boolean(prod.priceId))
// create order id in the database
const order = await payload.create({
  collection: "orders",
  data:{_isPaid:false,
    products: filteredProducts,
    user: user.id

  }
})
//create a checkout session for these products
      
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { user, order, line_items } = req.body;

    // Define the PayFast payment details
    const paymentData = {
      amount: order.totalPrice.toFixed(2),
      item_name: 'Order Payment',
      return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
      notify_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/payfast-ipn`,
      custom_str1: user.id,
      custom_str2: order.id,
    };

    // Store the payment data in the session
    req.session.paymentData = paymentData;

    // Generate PayFast payment URL
    const paymentUrl = createPaymentUrl(paymentData);

    // Send the payment URL back to the client
    return res.json({ url: paymentUrl });
  } catch (err) {
    console.error('Error creating PayFast session:', err);
    return res.json({ url: null });
  }
});



    }),
});
export default router;