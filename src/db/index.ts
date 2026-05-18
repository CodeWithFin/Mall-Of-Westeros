import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is required. Get a connection string from https://console.neon.tech'
  );
}

// Neon serverless Postgres (not Supabase)
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
