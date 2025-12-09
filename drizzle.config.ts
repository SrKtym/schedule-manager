import { defineConfig } from 'drizzle-kit';
import { serverEnv } from './env/server';

export default defineConfig({
    out: './lib/drizzle/migration',
    schema: './lib/drizzle/schemas',
    dialect: 'postgresql',
    dbCredentials: {
        url: serverEnv.DATABASE_URL
    },
    entities: {
        roles: {
            provider: 'supabase'
        }
    }
})