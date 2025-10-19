// データ取得系
'use server-only';

import { db } from "../lib/drizzle";
import { auth } from "@/lib/better-auth/auth";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { course, registered, schedule, users } from "../lib/drizzle/schema/public";
import { asc, eq } from "drizzle-orm";


export const fetchSession = cache(async () => {
    const settionData = await auth.api.getSession({
        headers: await headers()
    });
    return settionData;
});

export async function fetch2faCookie() {
    const cookieStore = await cookies();
    const cookieName = process.env.NODE_ENV === 'development' ?
        'better-auth.two_factor' : 
        '__Secure-better-auth.two_factor';
    return cookieStore.get(cookieName)?.value;
}

export async function fetchThemeCookie() {
    const cookieStore = await cookies();
    return cookieStore.get('theme')?.value || 'light';
}

// 講義一覧の取得
export const fetchCourse = cache(async (
    gradeList: string[], 
    facultyList: string[],
    departmentList: string[],
    weekList: string[],
    periodList: string[],
    creditList: string[],
    requiredList: string[],
    page?: number,
    rows?: number,
    query?: string
) => {
    const result = await db.query.course.findMany({
        where: (course, {or, and, inArray, isNull, ilike}) => 
            or(
                and(
                    inArray(course.targetGrade, gradeList as []),
                    or(
                        inArray(course.targetFaculty, facultyList as []),
                        isNull(course.targetFaculty)
                    ),
                    or(
                        inArray(course.targetDepartment, departmentList as []),
                        isNull(course.targetDepartment)
                    ),
                    inArray(course.week, weekList as []),
                    inArray(course.period, periodList as []),
                    inArray(course.credit, creditList as []),
                    inArray(course.required, requiredList as []),
                ),
                ilike(course.name, `%${query}%`),
                ilike(course.professor, `%${query}%`)
            ),
        limit: rows || 10,
        offset: ((page || 1) - 1) * (rows || 10)
    });
    return result;
});

// 講義の総数を取得
export const fetchItemsLength = cache(async (
    gradeList: string[], 
    facultyList: string[],
    departmentList: string[],
    weekList: string[],
    periodList: string[],
    creditList: string[],
    requiredList: string[],
    query?: string
) => {
    const result = await db.query.course.findMany({
        where: (course, {or, and, inArray, isNull, ilike}) => 
            or(
                and(
                    inArray(course.targetGrade, gradeList as []),
                    or(
                        inArray(course.targetFaculty, facultyList as []),
                        isNull(course.targetFaculty)
                    ),
                    or(
                        inArray(course.targetDepartment, departmentList as []),
                        isNull(course.targetDepartment)
                    ),
                    inArray(course.week, weekList as []),
                    inArray(course.period, periodList as []),
                    inArray(course.credit, creditList as []),
                    inArray(course.required, requiredList as [])
                ),
                ilike(course.name, `%${query}%`),
                ilike(course.professor, `%${query}%`)
                
            ),
        })
    return result.length;
})

// 登録済みの講義の詳細を取得
export const fetchRegisteredCourseData = cache(async (session: Awaited<ReturnType<typeof fetchSession>>) => {
    const result = await db
        .select({
            course: {
                name: course.name,
                period: course.period,
                week: course.week,
                credit: course.credit,
                classroom: course.classroom,
                professor: course.professor,
                targetFaculty: course.targetFaculty,
                targetDepartment: course.targetDepartment
            }})
        .from(registered)
        .innerJoin(course, eq(course.name, registered.name))
        .where(eq(registered.email, session?.user.email as string))
        .orderBy(asc(course.period));

    return result;
});

// 予定の取得
export const fetchSchedule = cache(async (session: Awaited<ReturnType<typeof fetchSession>>) => {
    const result = await db.query.schedule.findMany({
        where: (schedule, {eq}) => (eq(schedule.email, session?.user.email as string)),
        orderBy: (schedule, {asc}) => (asc(schedule.start))
    });
    
    return result;
});

// 通知の取得
export const fetchMessages = cache(async (session: Awaited<ReturnType<typeof fetchSession>>) => {
    const data = await db.query.messages.findMany({
        where: (messages, {eq}) => (eq(messages.receiverEmail, session?.user.email as string)),
        orderBy: (messages, {desc}) => (desc(messages.createdAt))
    });

    return data;
});

// 課題と添付ファイルメタデータの取得
export const fetchAssignmentData = cache(async (courseNameList: string[]) => {
    const result = await db.transaction(async (tx) => {
        const assignmentData = await tx.query.assignmentData.findMany({
            where: (assignmentData, {inArray}) => (inArray(assignmentData.courseName, courseNameList)),
        });
        
        const hasAttachments = assignmentData.filter(
            assignment => !!assignment.attachmentsMetaDataIds
        );
    
        const attachmentsMetaDataIds = hasAttachments.flatMap(
            assignment => assignment.attachmentsMetaDataIds as string[]
        );
    
        const attachmentMetaData = await tx.query.attachmentMetaData.findMany({
            where: (attachmentMetaData, {inArray}) => (
                inArray(attachmentMetaData.id, attachmentsMetaDataIds)
            ),
        });

        return {assignmentData, attachmentMetaData};
    });
    
    return result;
});

// 課題の状態の取得
export const fetchAssignmentStatus = cache(async (assignmentId: string) => {
    const assignmentStatus = await db.query.assignmentStatus.findMany({
        where: (assignmentStatus, {eq}) => (eq(assignmentStatus.assignmentId, assignmentId)),
        orderBy: (assignmentStatus, {desc}) => (desc(assignmentStatus.userName))
    });

    return assignmentStatus;
});

// 提出物メタデータの取得
export const fetchSubmissionMetaData = cache(async (assignmentId: string) => {
    const result = await db.transaction(async (tx) => {
        const submission = await tx.query.submission.findFirst({
            where: (submissionMetaData, {eq}) => (eq(submissionMetaData.assignmentId, assignmentId)),
        });

        const submissionMetaData = await tx.query.submissionMetaData.findMany({
            where: (submissionMetaData, {inArray}) => (
                inArray(submissionMetaData.id, submission?.submissionMetaDataIds as string[])
            ),
        });

        return {submission, submissionMetaData};
    });
    return result;
});

// アナウンスメントの取得
export const fetchAnnouncement = cache(async (courseNameList: string[]) => {
    const result = await db.query.announcement.findMany({
        where: (announcement, {inArray}) => (inArray(announcement.courseName, courseNameList)),
    });
    return result;
});

// コメントの取得
export const fetchComments = cache(async (id: string) => {
    const result = await db.query.comment.findMany({
        where: (comment, {or, eq}) => (
            or(
                eq(comment.assignmentId, id),
                eq(comment.announcementId, id)
            )
        ),
        orderBy: (comment, {desc}) => (desc(comment.updatedAt))
    });
    return result;
});

// メンバーの取得
export const fetchMemberList = cache(async (courseName: string) => {
    const userList = await db
        .select({
            users: {
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
            }
        })
        .from(users)
        .innerJoin(registered, eq(users.email, registered.email))
        .where(eq(registered.name, courseName));

    return userList;
});
