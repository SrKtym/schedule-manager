import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { handle } from 'hono/vercel';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod/v4';
import { db } from '@/lib/drizzle';
import { 
    attachmentMetaData, 
    course, 
    messages, 
    submissionMetaData 
} from '@/lib/drizzle/schemas/main';
import { and, eq } from 'drizzle-orm';
import { selectRegisteredSchema } from '@/schemas/select-schema';
import { fetchSession } from '@/utils/getters/auth';
import { sseClients } from '@/types/main/sse-clients';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getFileType } from '@/utils/helpers/assignment';
import { uploadFileSchema } from '@/schemas/form-schema';

// nodejsランタイム

const clientsMap = new Map<string, sseClients[]>();

export function sendMessages(userId: string, data: any) {
    const clients = clientsMap.get(userId) || [];
    clients.forEach(client => client.send(JSON.stringify(data)));
}

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

    // // 講義の新規登録または変更（個別）
    // .post('/course/single',
    //     zValidator(
    //         'json',
    //         selectRegisteredSchema.pick({name: true})
    //     ),
    //     async (c) => {
    //         const {name} = c.req.valid('json');
    //         const session = await fetchSession();
            
    //         if (!session) return c.text("Unauthorized", 401);

    //         const userId = session.user.id;
    //         await db.transaction(async (tx) => {
    //             const courseDataList = await tx
    //                 .select({
    //                     period: course.period,
    //                     week: course.week
    //                 })
    //                 .from(course)
    //                 .where(eq(course.name, name));

    //             await tx
    //                 .insert(registered)
    //                 .values({
    //                     name: name,
    //                     period: courseDataList[0].period,
    //                     week: courseDataList[0].week,
    //                     userId: userId
    //                 })
    //                 .onConflictDoUpdate({
    //                     target: [registered.userId, registered.period, registered.week],
    //                     set: {
    //                         name: name
    //                     }
    //                 });
    //         })

    //         return c.json({
    //             success: '履修登録に成功しました。'
    //         });
    //     }
    // )

    // // 講義の新規登録（一括）
    // .post('/course/multiple',
    //     zValidator(
    //         'json',
    //         selectRegisteredSchema.pick({name: true}).extend({
    //             name: z.array(z.string())
    //         })
    //     ),
    //     async (c) => {
    //         const {name} = c.req.valid('json'); 
    //         const session = await fetchSession();

    //         if (!session) return c.text("Unauthorized", 401);

    //         const userId = session.user.id;   
    //         await db.transaction(async (tx) => {
    //             const courseDataList = await tx
    //                 .select({
    //                     name: course.name,
    //                     period: course.period,
    //                     week: course.week
    //                 })
    //                 .from(course)
    //                 .where(inArray(course.name, name));

    //             const dataList = courseDataList.map((row) => {return {...row, userId: userId}});

    //             await tx
    //                 .insert(registered)
    //                 .values(dataList)
    //                 .onConflictDoNothing();
    //         });

    //         return c.json({
    //             success: '履修登録に成功しました。'
    //         });
    //     })

    // // 登録済み講義の削除
    // .delete('/course', 
    //     zValidator(
    //         'json',
    //         selectRegisteredSchema.pick({name: true})
    //     ),
    //     async (c) => {
    //         const {name} = c.req.valid('json');
    //         const session = await fetchSession();

    //         if (!session) return c.text("Unauthorized", 401);

    //         const userId = session.user.id;
    //         await db.delete(registered).where(
    //             and(
    //                 eq(registered.name, name),
    //                 eq(registered.userId, userId)
    //             )
    //         );
    //         return c.json({
    //             success: '登録を解除しました。'
    //         });
    //     })

    // // 通知を既読に変更
    // .patch('/messages',
    //     zValidator(
    //         'json',
    //         z.string()
    //     ),
    //     async (c) => {
    //         const id = c.req.valid('json');
    //         await db
    //             .update(messages)
    //             .set({isRead: true})
    //             .where(eq(messages.id, id))

    //         return c.json({
    //             success: '既読済み'
    //         });
    //     }
    // )

    // // 課題の提出または編集（学生用）
    // .post('/assignment',
    //     zValidator(
    //         'json',
    //         z.object({
    //             assignment: selectAssignmentStatusSchema.omit({
    //                 evaluated: true,
    //                 userId: true
    //             }),
    //             submission: selectSubmissionMetaDataSchema.pick({
    //                 name: true,
    //                 type: true,
    //                 url: true
    //             })
    //         })
    //     ),
    //     async (c) => {
    //         const {assignment, submission} = c.req.valid('json');
    //         const session = await fetchSession();

    //         if (!session) return c.text("Unauthorized", 401);

    //         const userId = session.user.id;

    //         await db.transaction(async (tx) => {
    //             await tx
    //                 .insert(assignmentStatus)
    //                 .values({
    //                     assignmentId: assignment.assignmentId,
    //                     courseName: assignment.courseName,
    //                     userName: assignment.userName,
    //                     status: assignment.status,
    //                     userId
    //                 })
    //                 .onConflictDoUpdate({
    //                     target: [
    //                         assignmentStatus.assignmentId, 
    //                         assignmentStatus.courseName, 
    //                         assignmentStatus.userId
    //                     ],
    //                     set: {
    //                         status: assignment.status
    //                     }
    //             });

    //             await tx
    //                 .insert(submissionMetaData)
    //                 .values({
    //                     name: submission.name,
    //                     type: submission.type,
    //                     url: submission.url,
    //                     userId
    //                 })
    //                 .onConflictDoUpdate({
    //                     target: submissionMetaData.url,
    //                     set: {
    //                         name: submission.name,
    //                         type: submission.type,
    //                         url: submission.url
    //                     }
    //                 });
    //         });

    //         return c.json({
    //             success: '提出または編集に成功しました。'
    //         });
    //     }
    // )

    // // 講義資料メタデータの保存と更新（教員用）
    // .post('/material',
    //     zValidator(
    //         'json',
    //         selectAttachmentMetaDataSchema.pick({
    //             name: true,
    //             type: true,
    //             url: true
    //         })
    //     ),
    //     async (c) => {
    //         const {name, type, url} = c.req.valid('json');

    //         await db.insert(attachmentMetaData)
    //             .values({
    //                 name: name,
    //                 type: type,
    //                 url: url,

    //             })
    //             .onConflictDoUpdate({
    //                 target: attachmentMetaData.url,
    //                 set: {
    //                     name: name,
    //                     type: type,
    //                     url: url
    //                 }
    //             });

    //         return c.json({
    //             success: 'ファイルのメタデータを保存しました。'
    //         });
    //     }
    // )

    // server-sent eventsを使ったリアルタイム通知
    .get('/sse', async (c) => {
        const session = await fetchSession();

        if (!session) return c.text("Unauthorized", 401);

        const userId = session.user.id;
        const clientId = crypto.randomUUID();
        
        return streamSSE(c, async (stream) => {
            // 登録処理
            const send = async (data: string) => await stream.writeSSE({data});
            if (!clientsMap.has(userId)) clientsMap.set(userId, []);
            clientsMap.get(userId)?.push({clientId, userId, send});

            // 切断処理
            const close = async () => {
                const arr = clientsMap.get(userId) || [];
                clientsMap.set(userId, arr.filter((client) => client.clientId !== clientId));
            };

            stream.onAbort(close);
        })
    })

    // ファイルのアップロード
    .post('/upload/multipart', async (c) => {
        const session = await fetchSession();

        if (!session) return c.text("Unauthorized", 401);

        const validatedFields = uploadFileSchema.omit({fileId: true}).safeParse({
            contentType: c.req.header("content-type"),
            fileName: c.req.header("x-file-name"),
            courseName: c.req.header("x-course-name"),
            relatedTo: c.req.header("x-related-to"),
        });

        if (validatedFields.error) return c.text(validatedFields.error.message, 400);

        const {contentType, fileName, courseName, relatedTo} = validatedFields.data;
        const fileId = crypto.randomUUID();
        const type = getFileType(contentType);
        const stream = await c.req.arrayBuffer();

        switch (relatedTo) {
            case 'submission': {
                const filePath = `${courseName}/${relatedTo}/${session.user.id}/${fileId}-${fileName}`;
                const {data, error} = await supabaseAdmin.storage
                    .from("attachments")
                    .upload(filePath, stream, {
                        cacheControl: "3600",
                        contentType,
                        upsert: false,
                        duplex: "half"
                    });

                 if (!data || error) return c.text("failed upload");

                await db.insert(submissionMetaData)
                    .values({
                        id: fileId,
                        name: fileName,
                        type,
                        url: data.path,
                        userId: session.user.id
                    })
                    .onConflictDoUpdate({
                        target: submissionMetaData.url,
                        set: {
                            name: fileName,
                            type,
                            url: data.path
                        }
                    });

                return c.text("success");
            }
            default: {
                const filePath = `${courseName}/${relatedTo}/${fileId}-${fileName}`
                const {data, error} = await supabaseAdmin.storage
                    .from("attachments")
                    .upload(filePath, stream, {
                        cacheControl: "3600",
                        contentType,
                        upsert: false,
                        duplex: "half"
                    });

                 if (!data || error) return c.text("failed upload");

                await db.insert(attachmentMetaData)
                    .values({
                        id: fileId,
                        name: fileName,
                        type,
                        url: data.path,
                        userId: session.user.id
                    })
                    .onConflictDoUpdate({
                        target: attachmentMetaData.url,
                        set: {
                            name: fileName,
                            type,
                            url: data.path
                        }
                    });

                return c.text(fileId);
            }
        }
    })

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
// export const PATCH = handle(app);
// export const DELETE = handle(app);
