import knex from "knex";
import { readFileSync } from "fs";
import path from "path";
import process from "process";
import { calculateDistance, serializeAddress } from "./utils";

const db = knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: ":memory:",
  },
});

export type AddressRow = {
  guid: string;
  isActive: number;
  address: string;
  latitude: number;
  longitude: number;
  tags: string;
};

export type Address = {
  guid: string;
  isActive: boolean;
  address: string;
  latitude: number;
  longitude: number;
  tags: string[];
};

type Distance = {
  from: Address;
  to: Address;
  unit: "km";
  distance: number;
};

export async function createTable(): Promise<void> {
  await db.schema.dropTableIfExists("address");

  await db.schema.createTable("address", (table) => {
    table.string("guid").primary();
    table.boolean("isActive");
    table.string("address");
    table.float("latitude");
    table.float("longitude");
    table.json("tags");
  });
}

export async function seedDatabase(): Promise<void> {
  const addresses = readFileSync(
    path.join(process.cwd(), "./assets/addresses.json"),
    "utf-8"
  );
  const parsedAddresses = JSON.parse(addresses) as Address[];

  for (const address of parsedAddresses) {
    await db
      .insert({
        guid: address.guid,
        isActive: address.isActive,
        address: address.address,
        latitude: address.latitude,
        longitude: address.longitude,
        tags: JSON.stringify(address.tags),
      })
      .into("address");
  }
}

export async function getAddressesByTag(
  tag: string,
  isActive: boolean
): Promise<Address[]> {
  const addresses = await db<AddressRow>("address").where(function () {
    this.where("tags", "LIKE", `%${tag}%`).andWhere("isActive", isActive);
  });

  return addresses.map((row) => serializeAddress(row));
}

export async function getDistance(
  from: string,
  to: string
): Promise<Distance | null> {
  const fromAddress = await db<AddressRow>("address")
    .where({ guid: from })
    .first();
  const toAddress = await db<AddressRow>("address").where({ guid: to }).first();

  if (!fromAddress || !toAddress) {
    return null;
  }

  const distance = calculateDistance(fromAddress, toAddress);

  return {
    from: serializeAddress(fromAddress),
    to: serializeAddress(toAddress),
    unit: "km",
    distance,
  };
}

export async function getAddressesInRadius(
  from: string,
  distance: number
): Promise<Address[] | null> {
  const fromAddress = await db<AddressRow>("address")
    .where({ guid: from })
    .first();

  if (!fromAddress) {
    return null;
  }

  const addresses = await db<AddressRow>("address").whereNot({
    guid: from,
  });

  const addressesInRadius = addresses.filter((address) => {
    const addressDistance = calculateDistance(fromAddress, address);
    return addressDistance <= distance;
  });

  return addressesInRadius.map(serializeAddress);
}

export async function getAllAddresses(): Promise<Address[]> {
  const addresses = await db<AddressRow>("address");
  return addresses.map((address) => serializeAddress(address));
}
