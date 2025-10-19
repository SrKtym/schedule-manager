import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod/v4';
import { db } from '@/lib/drizzle';
import { 
    assignmentStatus, 
    attachmentMetaData, 
    course, 
    messages, 
    registered, 
    schedule, 
    settings, 
    submissionMetaData 
} from '@/lib/drizzle/schema/public';
import { and, eq, inArray } from 'drizzle-orm';
import { 
    selectAssignmentStatusSchema, 
    selectAttachmentMetaDataSchema, 
    selectRegisteredSchema, 
    selectScheduleSchema, 
    selectSubmissionMetaDataSchema 
} from '@/schemas/select-schema';

// nodejsランタイム

const app = new Hono()
    .basePath('/api')

    // 登録済み講義の取得
    .get('/course',
        zValidator(
            'query',
            selectRegisteredSchema.pick({period: true, week: true})
        ),
        async (c) => {
            const {period, week} = c.req.valid('query');
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
            selectRegisteredSchema.pick({email: true, name: true})
        ),
        async (c) => {
            const {email, name} = c.req.valid('json');
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
            selectRegisteredSchema.pick({email: true, name: true}).extend({
                name: z.array(z.string())
            })
        ),
        async (c) => {
            const {email, name} = c.req.valid('json');    
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
            selectRegisteredSchema.pick({name: true})
        ),
        async (c) => {
            const {name} = c.req.valid('json');
            await db.delete(registered).where(eq(registered.name, name));
            return c.json({
                success: '登録を解除しました。'
            });
        })

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

    // 課題の提出または編集（学生用）
    .post('/assignment',
        zValidator(
            'json',
            z.object({
                assignment: selectAssignmentStatusSchema.omit({
                    evaluated: true
                }),
                submission: selectSubmissionMetaDataSchema.pick({
                    name: true,
                    type: true,
                    url: true
                })
            })
        ),
        async (c) => {
            const {assignment, submission} = c.req.valid('json');

            await db.transaction(async (tx) => {
                await tx
                    .insert(assignmentStatus)
                    .values({
                        assignmentId: assignment.assignmentId,
                        courseName: assignment.courseName,
                        email: assignment.email,
                        userName: assignment.userName,
                        status: assignment.status
                    })
                    .onConflictDoUpdate({
                        target: [
                            assignmentStatus.assignmentId, 
                            assignmentStatus.courseName, 
                            assignmentStatus.email
                        ],
                        set: {
                            status: assignment.status
                        }
                });

                await tx
                    .insert(submissionMetaData)
                    .values({
                        name: submission.name,
                        type: submission.type,
                        url: submission.url
                    })
                    .onConflictDoUpdate({
                        target: submissionMetaData.url,
                        set: {
                            name: submission.name,
                            type: submission.type,
                            url: submission.url
                        }
                    });
            });

            return c.json({
                success: '提出または編集に成功しました。'
            });
        }
    )

    // 講義資料メタデータの保存と更新（教員用）
    .post('/material',
        zValidator(
            'json',
            selectAttachmentMetaDataSchema.pick({
                name: true,
                type: true,
                url: true
            })
        ),
        async (c) => {
            const {name, type, url} = c.req.valid('json');

            await db.insert(attachmentMetaData)
                .values({
                    name: name,
                    type: type,
                    url: url,

                })
                .onConflictDoUpdate({
                    target: attachmentMetaData.url,
                    set: {
                        name: name,
                        type: type,
                        url: url
                    }
                });

            return c.json({
                success: 'ファイルのメタデータを保存しました。'
            });
        }
    )

    // スケジュールの削除
    .delete('/schedule',
        zValidator(
            'json',
            selectScheduleSchema.pick({id: true})
        ),
        async (c) => {
            const {id} = c.req.valid('json');
            await db.delete(schedule).where(eq(schedule.id, id));
            return c.json({
                success: 'スケジュールを削除しました。'
            });
        }
    )

    // テーマの変更
    .post('/theme',
        zValidator(
            'json',
            z.object({
                email: z.string().email(),
                checked: z.boolean()
            })
        ),
        async (c) => {
            const {email, checked} = c.req.valid('json');
            const theme = await db
                .insert(settings)
                .values({
                    email: email,
                    theme: checked ? 'dark' : 'light' 
                })
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
