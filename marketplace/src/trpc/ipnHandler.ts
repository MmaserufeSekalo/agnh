// src/services/ipnHandler.ts
import express from "express";

export const ipnHandler = express.Router();

ipnHandler.post("/payfast/ipn", (req, res) => {
  const ipnData = req.body;

  // Add logic here to verify IPN with PayFast and process the payment
  console.log("Received IPN:", ipnData);
  res.status(200).send("IPN received");
});
