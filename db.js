"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// db.ts
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { Pool } = pg_1.default;
// Create PostgreSQL connection pool
exports.pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});
// Optional: test the connection on startup
exports.pool
    .connect()
    .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
})
    .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err);
});
