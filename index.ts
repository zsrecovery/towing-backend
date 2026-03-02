import dotenv from "dotenv";
import app from "./server";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 10000;

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("❌ JWT secrets missing! Check .env file.");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});