//database client that is used in the entire application, optimised resources by caching. this, nodemon, tsconfig.server.json, payload.config.ts and get-payload.ts are for the admin dashboard

import dotenv from "dotenv"; // .env where sensitve variables ar stored
import nodemailer from "nodemailer"
import path from "path";
import type { InitOptions } from "payload/config";
import payload, { Payload } from "payload";


dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

/*define transport*/
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// to get our client, to save resources on this
let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}
//recieves parameters

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {

  // this is important for the sign in auth
 

  if (cached.client) {
    return cached.client;
  }

 /* if (!cached.promise) {
    cached.promise = payload.init({
      email: {
        transport: transporter,
        //to be added when there is a custom domain
        fromAddress: "onboarding@resend.dev" ,
        fromName: "CatCart",
      },
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};
