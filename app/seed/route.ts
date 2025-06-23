import 'dotenv/config';
import { db } from "@/lib/drizzle";
import { course } from '@/lib/drizzle/schema/public';
import { courseList } from '@/lib/data';


export async function GET() {
    const res = await db.transaction(async (tx) => {
        try {
            await tx.insert(course).values(courseList.map((value) => {return value})).onConflictDoNothing();
            return Response.json({message: 'Database seeded successfully' });
        } catch (error) {
            tx.rollback();
            return Response.json({ error }, { status: 500 });
        }
    });
    return res;
}
