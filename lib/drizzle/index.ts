import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/lib/drizzle/schema/public';
import { env } from '@/env';


const client = postgres(env.DATABASE_URL, {prepare: false});

export const db = drizzle(client, {schema});