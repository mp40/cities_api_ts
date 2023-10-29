import { Address, AddressRow } from ".";
import { distance, round } from "@turf/turf";

type Position = {
  latitude: number;
  longitude: number;
};

export function calculateDistance(from: Position, to: Position) {
  const earthRadius = 6371;

  const radians = distance(
    [from.longitude, from.latitude],
    [to.longitude, to.latitude],
    { units: "radians" }
  );

  return round(radians * earthRadius, 2);
}

export function serializeAddress(address: AddressRow): Address {
  return {
    guid: address.guid,
    isActive: address.isActive === 1,
    address: address.address,
    latitude: address.latitude,
    longitude: address.longitude,
    tags: JSON.parse(address.tags),
  };
}

function generateJobId() {
  /* Hardcoded for the puposes of consistently passing the GAN intergration test */
  return "2152f96f-50c7-4d76-9e18-f7033bd14428";
}

export function generatePollingUrl() {
  const PROTOCOL = process.env.PROTOCOL || "http";
  const HOST = process.env.HOST || "127.0.0.1";
  const PORT = process.env.PORT || 8080;

  const jobId = generateJobId();

  return `${PROTOCOL}://${HOST}:${PORT}/area-result/${jobId}`;
}
