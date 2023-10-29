import express from "express";
import { router } from "./routes";
import { authorization } from "./middleware";

const app = express();

export const setupExpressServer = () => {
  return app;
};

app.use((req, res, next) => {
  const authorised = authorization(req);

  if (!authorised) {
    return res.status(401).send("Unauthorized");
  }

  next();
});

app.use("/", router);
