import next from "next";

const PORT = Number(process.env.PORT) || 3000;

export const nextApp = next({
  dev: process.env.NODE_ENV !== "production",
  port: PORT,
});
//forward all the logic to nextjs for self hosting
export const nextHandler = nextApp.getRequestHandler();
