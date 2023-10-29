import request from "supertest";
import { setupExpressServer } from "./index";

const app = setupExpressServer();

test("it handles authentication success", async () => {
  const req = request(app);
  const res = await req
    .get("/")
    .set("Authorization", "bearer dGhlc2VjcmV0dG9rZW4=");

  expect(res.status).toBe(200);
});

test("it handles authentication failure", async () => {
  const req = request(app);
  const res = await req.get("/").set("Authorization", "bearer 123");

  expect(res.status).toBe(401);
});

test("it handles undefined authentication", async () => {
  const req = request(app);
  const res = await req.get("/");

  expect(res.status).toBe(401);
});
