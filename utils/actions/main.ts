// データ更新系(POST method only)
'use server';

import { 
    createAnnouncementSchema, 
    createAssignmentSchema, 
    createCourseSchema, 
    scheduleSchema, 
    submitAssignmentSchema, 
    uploadFileSchema
} from '@/schemas/form-schema';
import { db } from '../../lib/drizzle';
import { serverClient } from '@/lib/supabase/server';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { fetchSession } from '../getters/auth';
import { 
    announcement, 
    assignmentData, 
    attachmentMetaData, 
    course, 
    messages, 
    registered, 
    schedule, 
    settings, 
    submission, 
    submissionMetaData
} from '../../lib/drizzle/schemas/main';
import { revalidatePath } from 'next/cache';
import z from 'zod/v4';
import { 
    AnnouncementState, 
    AssignmentState, 
    CourseState, 
    SubmissionState 
} from '@/types/main/regisered-course';
import { attachmentIsRelatedTo } from '@/constants/definitions';
import { and, eq, inArray } from 'drizzle-orm';


// 単一講義の登録
export async function registersingleCourse(courseName: string) {
    const session = await fetchSession();
    
    if (!session) return;

    const userId = session.user.id;

    await db.transaction(async (tx) => {
        const courseDataList = await tx
            .select({
                period: course.period,
                week: course.week
            })
            .from(course)
            .where(eq(course.name, courseName));

        await tx
            .insert(registered)
            .values({
                name: courseName,
                period: courseDataList[0].period,
                week: courseDataList[0].week,
                userId: userId
            })
            .onConflictDoUpdate({
                target: [registered.userId, registered.period, registered.week],
                set: {
                    name: courseName
                }
            });
    });

    revalidatePath('/home/register');

    return {
        success: true
    }
}

// 複数講義の登録
export async function registermultipleCourses(courseNameList: string[]) {
    const session = await fetchSession();
    
    if (!session) return;

    const userId = session.user.id;

    await db.transaction(async (tx) => {
        const courseDataList = await tx
            .select({
                name: course.name,
                period: course.period,
                week: course.week
            })
            .from(course)
            .where(inArray(course.name, courseNameList));

        const dataList = courseDataList.map((row) => {return {...row, userId: userId}});

        await tx
            .insert(registered)
            .values(dataList)
            .onConflictDoNothing();
    });

    revalidatePath('/home/register');

    return {
        success: true
    }
}

// 単一講義の削除
export async function deleteSingleCourse(courseName: string) {
    const session = await fetchSession();
    
    if (!session) return;

    const userId = session.user.id;

    await db.delete(registered).where(
        and(
            eq(registered.name, courseName),
            eq(registered.userId, userId)
        )
    );

    revalidatePath('/home/register');

    return {
        success: true
    }
}

// スケジュール作成
export async function createSchedule(formData: FormData) {
    const validatedFields = scheduleSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        start: formData.get('dateRangeStart'),
        end: formData.get('dateRangeEnd'),
        color: formData.get('color'),
    });

    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    }

    const session = await fetchSession();

    if (!session) return;

    const userId = session.user.id;

    await db
        .insert(schedule)
        .values({
            ...validatedFields.data,
            userId
        })
        .onConflictDoUpdate({
            target: [schedule.userId, schedule.start, schedule.end],
            set: {
                title: validatedFields.data.title,
                description: validatedFields.data.description,
                color: validatedFields.data.color
            }
        });

    revalidatePath('/home/schedule');

    return {
        success: true
    };
}

// スケジュールの削除
export async function deleteSchedule(id: string) {
    await db.delete(schedule).where(eq(schedule.id, id));
    revalidatePath('/home/schedule');
    return {
        success: true
    };
}

// 通知を既読に変更
export async function updateMessage(id: string) {
    await db
        .update(messages)
        .set({isRead: true})
        .where(eq(messages.id, id));
}

// 講義作成（教員用）
export async function createCourse(prevState: CourseState | undefined, formData: FormData) {
    const validatedFields = createCourseSchema.safeParse({
        name: formData.get('name'),
        targetGrade: formData.get('targetGrade'),
        targetFaculty: formData.get('targetFaculty'),
        targetDepartment: formData.get('targetDepartment'),
        week: formData.get('week'),
        period: formData.get('period'),
        credit: formData.get('credit'),
        required: formData.get('required'),
        professor: formData.get('professor'),
        classroom: formData.get('classroom'),
    });
    
    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    }
    
    await db
        .insert(course)
        .values(validatedFields.data)
        .onConflictDoNothing();

    revalidatePath('/home/register');
}

// アナウンスメント作成（教員用）
export async function createAnnouncement(prevState: AnnouncementState | undefined, formData: FormData) {
    const session = await fetchSession();

    if (!session) return;

    const userId = session.user.id;

    const validatedFields = createAnnouncementSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        courseName: formData.get('courseName'),
        attachmentIds: formData.get('attachmentIds'),
        type: formData.get('type'),
    });

    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    }
    
    await db
        .insert(announcement)
        .values({...validatedFields.data, userId})
        .onConflictDoNothing();

    revalidatePath(`/home/course-list/${validatedFields.data.courseName}`);
}

// 課題作成（教員用）
export async function createAssignment(prevState: AssignmentState | undefined, formData: FormData) {
    const session = await fetchSession();

    if (!session) return;

    const userId = session.user.id;

    const validatedFields = createAssignmentSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        courseName: formData.get('courseName'),
        points: formData.get('points'),
        dueDate: formData.get('dueDate'),
        attachmentIds: formData.get('attachmentIds'),
        fileType: formData.get('fileType'),
    });

    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    }
    
    await db
        .insert(assignmentData)
        .values({...validatedFields.data, userId})
        .onConflictDoNothing();

    revalidatePath(`/home/course-list/${validatedFields.data.courseName}`);
}

// 課題の提出
export async function submitAssignment(prevState: SubmissionState | undefined, formData: FormData) {
    const session = await fetchSession();

    if (!session) return;

    const userId = session.user.id;

    const validatedFields = submitAssignmentSchema.safeParse({
        assignmentId: formData.get('assignmentId'),
        content: formData.get('content'),
    });

    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    }

    await db
        .insert(submission)
        .values({...validatedFields.data, userId})
        .onConflictDoNothing();
} 

// ファイルの削除
export async function removeFile(fileId: string, relatedTo: typeof attachmentIsRelatedTo[number]) {
    const validatedFields = uploadFileSchema.pick({
        fileId: true,
        relatedTo: true
    }).safeParse({
        fileId,
        relatedTo
    });

    if (!validatedFields.success) return;

    const session = await fetchSession();

    if (!session) return;

    const userId = session.user.id;

    switch (validatedFields.data.relatedTo) {
        case 'submission': {
            const result = await db.query.submissionMetaData.findFirst({
                where: (submissionMetaData, {and, eq}) => (
                    and(
                        eq(submissionMetaData.id, validatedFields.data.fileId),
                        eq(submissionMetaData.userId, userId)
                    )
                )
            });

            if (!result) return;

            const supabaseAdmin = await serverClient(); 
            const {data, error} = await supabaseAdmin
                .storage
                .from("documents")
                .remove([result.url]);

            if (!data || error) {
                await db
                    .delete(submissionMetaData)
                    .where(eq(submissionMetaData.id, validatedFields.data.fileId));
            }
        }
        default: {
            const result = await db.query.attachmentMetaData.findFirst({
                where: (attachmentMetaData, {and, eq}) => (
                    and(
                        eq(attachmentMetaData.id, validatedFields.data.fileId),
                        eq(attachmentMetaData.userId, userId)
                    )
                )
            });

            if (!result) return;

            const supabaseAdmin = await serverClient();
            const {data, error} = await supabaseAdmin
                .storage
                .from("documents")
                .remove([result.url]);

            if (!data || error) {
                await db
                    .delete(attachmentMetaData)
                    .where(eq(attachmentMetaData.id, validatedFields.data.fileId));
            }
        }
    }
}

// テーマの変更
export const setTheme = cache(async (checked: boolean) => {
    const session = await fetchSession();

    if (!session) return 'light';

    const theme = await db
        .insert(settings)
        .values({
            userId: session.user.id,
            theme: checked ? 'dark' : 'light' 
        })
        .onConflictDoUpdate({
            target: settings.userId,
            set: {
                theme: checked ? 'dark' : 'light'
            }
        })
        .returning({color: settings.theme});

    return theme[0].color;
});

// テーマの変更をcookieに反映する
export const setThemeCookie = cache(async () => {
    const cookieStore = await cookies();
    const session = await fetchSession();
    
    if (!session) return;
    
    const settings = await db.query.settings.findFirst({
        where: (settings, {eq}) => (eq(settings.userId, session.user.id))
    });
    cookieStore.set({
        name: 'theme',
        value: settings?.theme || 'light',
        path: '/home'
    });
});







