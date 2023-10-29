import { calculateDistance } from "./utils";

test("it calculates the distance between two points", () => {
  const distance = calculateDistance(
    { latitude: -1.409358, longitude: -37.257104 },
    { latitude: 46.965565, longitude: -172.744857 }
  );

  expect(distance).toBe(13376.38);
});
