// src/app.ts
import express from "express";
import { createPaymentUrl } from "./trpc/payfast";
import { ipnHandler } from "./trpc/ipnHandler";

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get("/pay", (req, res) => {
  const paymentUrl = createPaymentUrl({
    amount: "100.00",
    item_name: "Test Product",
    return_url: "https://your-site.com/success",
    cancel_url: "https://your-site.com/cancel",
    notify_url: "https://your-site.com/notify",
  });

  res.redirect(paymentUrl);
});

app.use(ipnHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
