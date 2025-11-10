import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables from .env.local first, then .env
config({ path: ".env.local" });
config(); // Also try .env

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Please create a .env.local file with your database connection string.\n" +
    "Example: DATABASE_URL=postgresql://user:password@host:port/database"
  );
}

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});

