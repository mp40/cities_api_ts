import express from "express";
import request from "supertest";
import * as model from "./model/index";
import * as utils from "./model/utils";
import { router } from "./routes";
import jobQueue from "./services/queue";

const app = express();
app.use("/", router);

test("cities by tag: it handles invalid query params", async () => {
  const req = request(app);
  const res = await req.get("/cities-by-tag").query({
    wrong: "value",
  });

  expect(res.status).toBe(400);
});

test("cities by tag: it returns cities", async () => {
  vi.spyOn(model, "getAddressesByTag").mockResolvedValueOnce([
    {
      guid: "123",
      isActive: true,
      address: "123",
      latitude: 123,
      longitude: 123,
      tags: ["fake-tag"],
    },
  ]);

  const req = request(app);
  const res = await req.get("/cities-by-tag").query({
    tag: "fake-tag",
    isActive: true,
  });

  expect(res.body).toEqual({
    cities: [
      {
        guid: "123",
        isActive: true,
        address: "123",
        latitude: 123,
        longitude: 123,
        tags: ["fake-tag"],
      },
    ],
  });
});

test("distance: it handles invalid query params", async () => {
  const req = request(app);
  const res = await req.get("/distance").query({
    wrong: "value",
  });

  expect(res.status).toBe(400);
});

test("distance: it returns distance between to locations", async () => {
  vi.spyOn(model, "getDistance").mockResolvedValueOnce({
    from: { guid: "123" } as model.Address,
    to: { guid: "456" } as model.Address,
    unit: "km",
    distance: 789,
  });

  const req = request(app);

  const res = await req.get("/distance").query({
    from: "123",
    to: "456",
  });

  expect(res.body).toEqual({
    from: { guid: "123" },
    to: { guid: "456" },
    unit: "km",
    distance: 789,
  });
});

test("area: it handles invalid query params", async () => {
  const req = request(app);
  const res = await req.get("/area").query({
    from: "123",
    distance: "x",
  });

  expect(res.status).toBe(400);
});

test("area: it returns a url for polling", async () => {
  vi.spyOn(utils, "createQueuedJob").mockResolvedValueOnce(
    "http://127.0.0.1:8080/area-result/fake-job-id"
  );
  const req = request(app);
  const res = await req.get("/area").query({
    from: "123",
    distance: 100,
  });

  expect(res.status).toBe(202);
  expect(res.body).toEqual({
    resultsUrl: "http://127.0.0.1:8080/area-result/fake-job-id",
  });
});

test("area-result: it returns 202 if completed job not found", async () => {
  vi.spyOn(jobQueue, "getJobResult").mockReturnValueOnce(undefined);

  const req = request(app);
  const res = await req.get("/area-result/abc");

  expect(res.status).toBe(202);
});

test("area-result: it returns locations if job complete", async () => {
  vi.spyOn(jobQueue, "getJobResult").mockReturnValueOnce([]);

  const req = request(app);
  const res = await req.get("/area-result/abc");

  expect(res.body).toEqual({
    cities: [],
  });
});
