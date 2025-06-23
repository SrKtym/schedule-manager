import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { env } from './env';

config({path: '.env'});

export default defineConfig({
    out: './lib/drizzle/migration',
    schema: './lib/drizzle/schema',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL
    },
    entities: {
        roles: {
            provider: 'supabase'
        }
    }
})