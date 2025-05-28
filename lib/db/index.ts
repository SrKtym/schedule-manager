import { config } from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/lib/db/schema/public';
import { env } from '@/env';

config({path: '.env'});

const client = postgres(env.DATABASE_URL, {prepare: false});

export const db = drizzle(client, {schema});