// db.ts
import { Pool } from "pg";
console.log("DATABASE_URL at runtime:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing");
  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
