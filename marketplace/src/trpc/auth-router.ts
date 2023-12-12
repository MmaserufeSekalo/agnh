//separate api endpoint handling the authentication process

import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({
    //create a user for sign-up page form, anyone can call this api endpoint. sign up is a public point
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    //access to form inputs
    .mutation(async ({ input }) => {
      const { email, password } = input;
      //access to cms to create a user
      const payload = await getPayloadClient();

      // check if user already exists, if they do they cant sign up again
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });
//logic checking 
      if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" });

      //collection is an example of database table.usser added to the users collection
      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      return { success: true, sentToEmail: email };
    }),

    //auth api, access to cms client: call payload. verify email

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: "users",
        token,
      });
//if it fails throw an error
      if (!isVerified) throw new TRPCError({ code: "UNAUTHORIZED" });

      return { success: true };
    }),

    //backend api router, anyone should be able to call it that is why it is public
  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      //
      const { res } = ctx;

      const payload = await getPayloadClient();

      try {
        await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          res,
        });

        return { success: true };
      } catch (err) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),
});
