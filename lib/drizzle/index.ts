import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as mainSchema from '@/lib/drizzle/schemas/main';
import * as betterAuthSchema from '@/lib/drizzle/schemas/better-auth';
import * as mainRelation from '@/lib/drizzle/relations/main'
import { env } from '@/env';

// データベース（supabase）にssl接続
const client = postgres(env.DATABASE_URL, {
    prepare: false,
    ssl: "require"
});

export const db = drizzle(client, {
    schema: {
        ...mainSchema,
        ...betterAuthSchema,
        ...mainRelation
    }
});