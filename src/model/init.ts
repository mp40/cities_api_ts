import { createTable, seedDatabase } from "./index.";

export async function setupDatabase() {
  console.log("create table");
  await createTable();

  console.log("seed table");
  await seedDatabase();

  console.log("database setup complete");
}
