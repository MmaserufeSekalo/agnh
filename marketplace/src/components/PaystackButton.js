// components/PaystackButton.js
import React from "react";
import { PaystackButton } from "react-paystack";

const PayButton = ({ email, amount, name, phone }) => {
  const publicKey = "pk_live_12fb5f7712dcdb67f04085b5aebbc3b6c6498b08";

  const componentProps = {
    email,
    amount,
    metadata: { name, phone },
    publicKey,
    text: "Pay Now",
    onSuccess: () => alert("Thanks for your purchase!"),
    onClose: () => alert("Payment cancelled."),
  };

  return <PaystackButton {...componentProps} />;
};

export default PayButton;
