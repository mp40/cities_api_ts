import knex from "knex";
import { readFileSync } from "fs";
import path from "path";
import process from "process";

const db = knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: ":memory:",
  },
});

type Address = {
  guid: string;
  isActive: boolean;
  address: string;
  latitude: number;
  longitude: number;
  tags: string[];
};

export async function createTable() {
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

export async function seedDatabase() {
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

export async function getAddressById(guid: string) {
  return await db("address").where({ guid }).first();
}
