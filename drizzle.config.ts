import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// Uses Neon Postgres via DATABASE_URL (see https://console.neon.tech)
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
