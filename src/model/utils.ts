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
