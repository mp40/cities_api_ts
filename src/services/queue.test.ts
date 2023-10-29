import * as model from "../model/index";
import { JobQueue } from "./queue";

test("it stores results", async () => {
  vi.spyOn(model, "getAddressesInRadius").mockResolvedValueOnce([
    {
      guid: "xyz",
      isActive: true,
      address: "fake address",
      latitude: 123,
      longitude: 123,
      tags: ["fake-tag"],
    },
  ]);

  const jobQueue = new JobQueue();
  jobQueue.jobs = [{ jobId: "123", from: "abc", distance: 100 }];

  await jobQueue.processJobs();

  expect(jobQueue.results.get("123")).toEqual([
    {
      guid: "xyz",
      isActive: true,
      address: "fake address",
      latitude: 123,
      longitude: 123,
      tags: ["fake-tag"],
    },
  ]);
});

test("it stores not found message if location not found", async () => {
  vi.spyOn(model, "getAddressesInRadius").mockResolvedValueOnce(null);

  const jobQueue = new JobQueue();
  jobQueue.jobs = [{ jobId: "123", from: "abc", distance: 100 }];

  await jobQueue.processJobs();

  expect(jobQueue.results.get("123")).toBe("not found");
});
