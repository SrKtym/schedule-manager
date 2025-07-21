import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '@/lib/drizzle';
import { course, messages, registered, settings } from '@/lib/drizzle/schema/public';
import { and, desc, eq, inArray } from 'drizzle-orm';

// nodejsランタイム

const app = new Hono()
    .basePath('/api')

    // 登録済み講義の取得
    .get('/course',
        zValidator(
            'query',
            z.object({
                period: z.enum(["1限目", "2限目", "3限目", "4限目", "5限目"]),
                week: z.enum(["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"])
            })
        ),
        async (c) => {
            const {period} = c.req.valid('query');
            const {week} = c.req.valid('query');
            const dataList = await db
                .select({
                    name: course.name,
                    credit: course.credit,
                    period: course.period,
                    week: course.week
                })
                .from(course)
                .where(
                    and(
                        eq(course.period, period),
                        eq(course.week, week)
                    )
                );
            return c.json(dataList);
        }
    )

    // 講義の新規登録または変更（個別）
    .post('/course/single',
        zValidator(
            'json',
            z.object({
                email: z.string(),
                name: z.string()
            })
        ),
        async (c) => {
            const {email} = c.req.valid('json');
            const {name} = c.req.valid('json');
            await db.transaction(async (tx) => {
                const sq = await tx
                    .select({
                        period: course.period,
                        week: course.week
                    })
                    .from(course)
                    .where(eq(course.name, name));

                await tx
                    .insert(registered)
                    .values({
                        email: email,
                        name: name,
                        period: sq[0].period,
                        week: sq[0].week
                    })
                    .onConflictDoUpdate({
                        target: [registered.email, registered.period, registered.week],
                        set: {
                            name: name
                        }
                    });
            })

            return c.json({
                success: '履修登録に成功しました。'
            });
        }
    )

    // 講義の新規登録（一括）
    .post('/course/multiple',
        zValidator(
            'json',
            z.object({
                email: z.string(),
                name: z.array(z.string())
            })
        ),
        async (c) => {
            const {email} = c.req.valid('json');
            const {name} = c.req.valid('json');
            await db.transaction(async (tx) => {
                const sq = await tx
                    .select({
                        name: course.name,
                        period: course.period,
                        week: course.week
                    })
                    .from(course)
                    .where(inArray(course.name, name));

                const dataList = sq.map((row) => {return {...row, email: email}});

                await tx
                    .insert(registered)
                    .values(dataList)
                    .onConflictDoNothing();
            });

            return c.json({
                success: '履修登録に成功しました。'
            });
        })

    // 登録済み講義の削除
    .delete('/course', 
        zValidator(
            'json',
            z.string()
        ),
        async (c) => {
            const name = c.req.valid('json');
            await db.delete(registered).where(eq(registered.name, name));
            return c.json({
                success: '登録を解除しました。'
            });
        })

    // 通知の取得
    .get('/messages',
        zValidator(
            'query',
            z.object({
                email: z.string()
            })
        ),
        async (c) => {
            const {email} = c.req.valid('query');
            const data = await db
                .select()
                .from(messages)
                .where(eq(messages.receiverEmail, email))
                .orderBy(desc(messages.createdAt))

            return c.json(data);
        }
    )

    // 通知を既読に変更
    .patch('/messages',
        zValidator(
            'json',
            z.string()
        ),
        async (c) => {
            const id = c.req.valid('json');
            await db
                .update(messages)
                .set({isRead: true})
                .where(eq(messages.id, id))

            return c.json({
                success: '既読済み'
            });
        }
    )

    // テーマの変更
    .post('/theme',
        zValidator(
            'json',
            z.object({
                email: z.string(),
                checked: z.boolean()
            })
        ),
        async (c) => {
            const {email} = c.req.valid('json');
            const {checked} = c.req.valid('json');
            const theme = await db
                .insert(settings)
                .values({email: email})
                .onConflictDoUpdate({
                    target: settings.email,
                    set: {
                        theme: checked ? 'dark' : 'light'
                    }
                })
                .returning({color: settings.theme});

            return c.json(theme[0].color);
        }

    )

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
