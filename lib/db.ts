import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

const globalForDb = global as unknown as {
    conn: ReturnType<typeof drizzle> | undefined;
};

export const db = globalForDb.conn ?? drizzle(sql, { schema });

if (process.env.NODE_ENV !== "production") globalForDb.conn = db;
