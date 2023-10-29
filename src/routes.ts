import { Router, Request, Response } from "express";
import { getAddressById } from "./model/index.";

export const router = Router({ strict: true });

router.get("/", (req: Request, res: Response) => {
  res.send("cities api");
});

router.get("/address/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const address = await getAddressById(id);
  res.json(address);
});
