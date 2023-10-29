import express from "express";
import { router } from "./routes";

const app = express();

export const setupExpressServer = () => {
  return app;
};

app.use("/", router);
