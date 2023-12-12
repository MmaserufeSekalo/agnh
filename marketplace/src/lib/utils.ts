import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
//this makes sure that the price is in the same format all across the web application
export function formatPrice(
  price: number | string,
  options: {
    currency?: "ZAR";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "ZAR", notation = "compact" } = options;

  //make sure that the input is a number, if it is a string transform it into a number 

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  //logic of the function

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}