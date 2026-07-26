import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config(); // Load .env file

// Fallback for Prisma CLI — prisma.config.ts blocks auto .env loading
const dbUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: dbUrl!,
  },
});
