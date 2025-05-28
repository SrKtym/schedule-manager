import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { env } from './env';

config({path: '.env'});

export default defineConfig({
    out: './lib/db/migration',
    schema: './lib/db/schema',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL
    }
})