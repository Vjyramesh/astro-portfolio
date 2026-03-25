// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "durable-sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});