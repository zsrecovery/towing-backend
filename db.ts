// db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing");
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Required for Render
    : false, // Local development
});

// Test connection on startup
pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
  });
