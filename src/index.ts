import express from "express";
import { router } from "./routes";

const app = express();

export const setupExpressServer = () => {
  return app;
};

app.use((req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader === undefined) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorizationHeader.replace("bearer ", "");

  try {
    if (atob(token) !== "thesecrettoken") {
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("Unauthorized");
  }

  next();
});

app.use("/", router);
