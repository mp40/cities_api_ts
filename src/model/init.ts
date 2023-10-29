import { createTable, seedDatabase } from ".";

export async function setupDatabase() {
  console.log("create table");
  await createTable();

  console.log("seed table");
  await seedDatabase();

  console.log("database setup complete");
}
