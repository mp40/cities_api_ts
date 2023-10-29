import { Request, Response, Router } from "express";
import { z } from "zod";
import {
  getAddressById,
  getAddressesByTag,
  getAllAddresses,
  getDistance,
} from "./model";
import { createQueuedJob } from "./model/utils";
import jobQueue from "./services/queue";

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

  const resultsUrl = await createQueuedJob(
    parsed.data.from,
    parsed.data.distance
  );

  res.status(202).json({
    resultsUrl,
  });
});

router.get("/area-result/:id", async (req: Request, res: Response) => {
  const jobId = req.params.id;

  const jobResult = jobQueue.getJobResult(jobId);

  if (!jobResult) {
    return res.sendStatus(202);
  }

  res.json({
    cities: jobResult,
  });
});

router.get("/all-cities", async (req: Request, res: Response) => {
  const cities = await getAllAddresses();

  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="all-cities.json"'
  );

  res.status(200).write("[");

  for (let i = 0; i < cities.length; i++) {
    res.write(JSON.stringify(cities[i]));
    if (i !== cities.length - 1) {
      res.write(",");
    }
  }

  res.write("]");
  res.end();
});
