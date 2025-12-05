import { createSelectSchema } from 'drizzle-zod';
import { registered } from '@/lib/drizzle/schemas/main';

export const selectRegisteredSchema = createSelectSchema(registered);



