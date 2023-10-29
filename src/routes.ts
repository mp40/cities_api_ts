import { Request, Response, Router } from "express";
import { z } from "zod";
import { getAddressById, getAddressesByTag, getDistance } from "./model";
import { generatePollingUrl } from "./model/utils";

export const router = Router({ strict: true });

router.get("/", (req: Request, res: Response) => {
  res.send("cities api");
});

router.get("/address/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const address = await getAddressById(id);
  res.json(address);
});

router.get("/cities-by-tag", async (req: Request, res: Response) => {
  const parsed = z
    .object({
      tag: z.string(),
      isActive: z.string().transform((x) => x === "true"),
    })
    .safeParse(req.query);

  if (!parsed.success) {
    return res.sendStatus(400);
  }

  const addresses = await getAddressesByTag(
    parsed.data.tag,
    parsed.data.isActive
  );

  res.json({ cities: addresses });
});

router.get("/distance", async (req: Request, res: Response) => {
  const parsed = z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .safeParse(req.query);

  if (!parsed.success) {
    return res.sendStatus(400);
  }

  const distance = await getDistance(parsed.data.from, parsed.data.to);

  res.json(distance);
});

router.get("/area", async (req: Request, res: Response) => {
  const parsed = z
    .object({
      from: z.string(),
      distance: z.string().transform((x) => Number(x)),
    })
    .safeParse(req.query);

  if (!parsed.success || isNaN(parsed.data.distance)) {
    return res.sendStatus(400);
  }

  res.status(202).json({
    resultsUrl: generatePollingUrl(),
  });
});
