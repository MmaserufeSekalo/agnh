//self hosting
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { nextApp, nextHandler } from "./next-utils";
import { getPayloadClient } from "./get-payload";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";

//define app
const app = express();
//define port, its either a number or string which can be converted to a number/ use 3000
const PORT = Number(process.env.Port) || 3000;

//create context
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});
//tell typescript where the context in the auth router comes from 
export type ExpressContext= inferAsyncReturnType<typeof createContext>

const start = async () => {
  //start up our cms or admin dashboard, info from payload function in
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
      },
    },
  });
  //allows us to take something from express (req,res) and attach them to context
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  //for every use(requests and responses), forward to next js
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
// in the nodemon file
/**
 //files to watch
//detects file changes
//run on
 */
