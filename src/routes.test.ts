import request from "supertest";
import express from "express";
import { router } from "./routes";
import * as model from "./model/index";

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
