import Paystack from "react-paystack";


export const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY ?? "" )