import "dotenv/config";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const pool = new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT ?? 5432),
  });

  const sql = readFileSync(
    join(__dirname, "../../migrations/001_initial.sql"),
    "utf-8",
  );

  await pool.query(sql);
  await pool.end();
  console.log("Migration complete");
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
