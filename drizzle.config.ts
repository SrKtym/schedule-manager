import { defineConfig } from 'drizzle-kit';
import { env } from './env';

export default defineConfig({
    out: './lib/drizzle/migration',
    schema: './lib/drizzle/schemas',
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