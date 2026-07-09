import "dotenv/config";
import { Kysely, PostgresDialect } from "kysely";
import { Pool, types } from "pg";
import type { Database } from "../types/db";

// Keep DATE columns as "YYYY-MM-DD" strings. pg's default parser turns them into
// Date objects at local midnight, which shifts the calendar day across timezones
// and breaks the string comparisons the streak logic relies on.
types.setTypeParser(types.builtins.DATE, (value) => value);

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT ?? 5432),
    max: 10,
  }),
});

export const db = new Kysely<Database>({ dialect });
