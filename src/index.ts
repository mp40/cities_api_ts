import express, { Request, Response } from "express";

const app = express();

export const setupExpressServer = () => {
  return app;
};

app.get("/", (req: Request, res: Response) => {
  res.send("working");
});
