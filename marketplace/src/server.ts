import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { nextApp, nextHandler } from "./next-utils";
import { getPayloadClient } from "./get-payload";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
      },
    },
  });

  app.get("/paystack", function (request, response) {
    const https = require("https");

    const params = JSON.stringify({
      email: "customer@email.com",
      amount: "20000",
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: "Bearer SECRET_KEY",
        "Content-Type": "application/json",
      },
    };

    const reqPaystack = https
      .request(options, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          response.send(data)
          console.log(JSON.parse(data));
          response.json(JSON.parse(data)); // Send response back to the client
        });
      })
      .on("error", (error) => {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" }); // Handle error and send response back to the client
      });

    reqPaystack.write(params);
    reqPaystack.end();
  });

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
