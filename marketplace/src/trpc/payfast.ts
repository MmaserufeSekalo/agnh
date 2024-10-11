import axios from "axios";
import crypto from "crypto";

interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  sandbox: boolean;
}

const payfastConfig: PayFastConfig = {
  merchantId: "in the env",
  merchantKey: "in the env",
  passphrase: "in the env", // Optional: can be omitted if not using secure passphrase
  sandbox: true, // Set to false for live transactions
};

const getBaseUrl = () => {
  return payfastConfig.sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
};
function generateSignature(params: any): string {
  const query = Object.keys(params)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  const queryString = payfastConfig.passphrase
    ? `${query}&passphrase=${payfastConfig.passphrase}`
    : query;

  return crypto.createHash("md5").update(queryString).digest("hex");
}

export function createPaymentUrl(data: any): string {
  const params = {
    merchant_id: payfastConfig.merchantId,
    merchant_key: payfastConfig.merchantKey,
    amount: data.amount,
    item_name: data.item_name,
    return_url: data.return_url,
    cancel_url: data.cancel_url,
    notify_url: data.notify_url,
    ...data.extraParams,
  };

  const signature = generateSignature(params);
  params["signature"] = signature;

  const baseUrl = getBaseUrl();
  const query = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  return `${baseUrl}?${query}`;
}
