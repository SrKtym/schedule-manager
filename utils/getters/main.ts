// データ取得系(GET method only)
import "server-only";

import { db } from "../../lib/drizzle";
import { cache } from "react";
import { 
    assignmentAttachmentMetaDataIds,
    course, 
    registered, 
    submissionMetaDataIds
} from "../../lib/drizzle/schemas/main";
import { users } from "../../lib/drizzle/schemas/better-auth";
import { asc, eq } from "drizzle-orm";
import { fetchSession } from "./auth";
import { cookies } from "next/headers";
import { Filter } from "@/types/main/regisered-course";


// テーマの取得
export async function fetchThemeCookie() {
    const cookieStore = await cookies();
    return cookieStore.get('theme')?.value || 'light';
}

// 講義一覧の取得
export const fetchCourse = cache(async (
    filter: Filter,
    page?: number,
    rows?: number,
    query?: string
) => {
    const result = await db.query.course.findMany({
        where: (course, {or, and, inArray, isNull, ilike}) => 
            or(
                and(
                    inArray(course.targetGrade, filter.gradeList),
                    or(
                        inArray(course.targetFaculty, filter.facultyList),
                        isNull(course.targetFaculty)
                    ),
                    or(
                        inArray(course.targetDepartment, filter.departmentList),
                        isNull(course.targetDepartment)
                    ),
                    inArray(course.week, filter.weekList),
                    inArray(course.period, filter.periodList),
                    inArray(course.credit, filter.creditList),
                    inArray(course.required, filter.requiredList),
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
    filter: Filter,
    query?: string
) => {
    const result = await db.query.course.findMany({
        where: (course, {or, and, inArray, isNull, ilike}) => 
            or(
                and(
                    inArray(course.targetGrade, filter.gradeList),
                    or(
                        inArray(course.targetFaculty, filter.facultyList),
                        isNull(course.targetFaculty)
                    ),
                    or(
                        inArray(course.targetDepartment, filter.departmentList),
                        isNull(course.targetDepartment)
                    ),
                    inArray(course.week, filter.weekList),
                    inArray(course.period, filter.periodList),
                    inArray(course.credit, filter.creditList),
                    inArray(course.required, filter.requiredList)
                ),
                ilike(course.name, `%${query}%`),
                ilike(course.professor, `%${query}%`)
                
            ),
        })
    return result.length;
})

// 登録済みの講義の詳細を取得
export const fetchRegisteredCourseData = cache(async (session: Awaited<ReturnType<typeof fetchSession>>) => {
    if (!session) return [];

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
        .where(eq(registered.userId, session.user.id))
        .orderBy(asc(course.period));

    return result;
});

// 予定の取得
export const fetchSchedule = cache(async (session: Awaited<ReturnType<typeof fetchSession>>) => {
    if (!session) return [];

    const result = await db.query.schedule.findMany({
        where: (schedule, {eq}) => (eq(schedule.userId, session.user.id)),
        orderBy: (schedule, {asc}) => (asc(schedule.start))
    });
    
    return result;
});

// 通知の取得
export const fetchMessages = cache(async (session: Awaited<ReturnType<typeof fetchSession>>) => {
    if (!session) return [];
    
    const result = await db.query.messages.findMany({
        where: (messages, {eq}) => (eq(messages.receiver, session.user.email)),
        orderBy: (messages, {desc}) => (desc(messages.createdAt))
    });

    return result;
});

// 課題と添付ファイルメタデータの取得
export const fetchAssignmentData = cache(async (
    session: Awaited<ReturnType<typeof fetchSession>>,
    courseNameList: string[]
) => {
    // const result = await db.transaction(async (tx) => {
    //     // 1. 講義リストをもとに課題のデータを取得
    //     const assignmentDataList = await tx
    //         .select()
    //         .from(assignmentData)
    //         .where(inArray(assignmentData.courseName, courseNameList));
        
    //     // 2. 課題のIDを格納した配列を展開
    //     const assignmentIds = assignmentDataList.flatMap(({id}) => id);
    
    //     // 3. 課題IDを用いて添付ファイルのメタデータIDを取得
    //     const attachmentMetaDataIds = tx
    //         .select({attachmentMetaDataId: assignmentAttachmentMetaDataIds.attachmentMetaDataId})
    //         .from(assignmentAttachmentMetaDataIds)
    //         .where(inArray(assignmentAttachmentMetaDataIds.assignmentId, assignmentIds))
    //         .as('attachmentMetaDataIds');

    //     // 4. メタデータリストに含まれる添付ファイルのメタデータを取得
    //     const attachmentMetaDataList = await tx
    //         .select()
    //         .from(attachmentMetaData)
    //         .where(inArray(attachmentMetaData.id, attachmentMetaDataIds.attachmentMetaDataId));

    //     return {assignmentDataList, attachmentMetaDataList};
    // });
    if (!session) return [];

    const result = await db.query.assignmentData.findMany({
        with: {
            assignmentStatus: true,
            attachmentMetaData: true,
            assignmentAttachmentMetaDataIds: true
        },
        where: (assignmentData, {and, eq, inArray}) => (
            and(
                eq(assignmentData.userId, session.user.id),
                inArray(assignmentData.courseName, courseNameList),
                inArray(assignmentAttachmentMetaDataIds.assignmentId, assignmentData.id)
            )
        )
    });
    
    return result;
});

// // 課題の状態の取得
// export const fetchAssignmentStatus = cache(async (assignmentId: string) => {
//     const assignmentStatus = await db.query.assignmentStatus.findMany({
//         where: (assignmentStatus, {eq}) => (eq(assignmentStatus.assignmentId, assignmentId)),
//         orderBy: (assignmentStatus, {desc}) => (desc(assignmentStatus.userName))
//     });

//     return assignmentStatus;
// });

// 提出物と添付ファイルメタデータの取得
export const fetchSubmissionData = cache(async (
    session: Awaited<ReturnType<typeof fetchSession>>,
    assignmentId: string
) => {
    if (!session) return [];

    // 提出物テーブルから課題に対応する提出物のID（複数可）を取得するサブクエリ
    const result = await db.query.submission.findMany({
        with: {
            assignmentStatus: true,
            submissionMetaData: true,
            submissionMetaDataIds: true
        },
        where: (submission, {and, inArray, eq}) => (
            and(
                eq(submission.userId, session.user.id),
                eq(submission.assignmentId, assignmentId),
                inArray(submissionMetaDataIds.submissionId, submission.id)
            )
        )
    });
    // const submissionIDs = db
    //     .select({id: submission.id})
    //     .from(submission)
    //     .where(eq(submission.assignmentId, assignmentId))
    //     .as('submissionIDs');

    // const result = await db
    //     .select({submissionMetaDataId: submissionMetaDataIds.submissionMetaDataId})
    //     .from(submissionMetaDataIds)
    //     .innerJoin(
    //         submissionIDs, 
    //         inArray(submissionMetaDataIds.submissionId, submissionIDs.id)
    //     );

    // const result = await db.transaction(async (tx) => {
    //     const submission = await tx.query.submission.findFirst({
    //         where: (submissionMetaData, {eq}) => (eq(submissionMetaData.assignmentId, assignmentId)),
    //     });

    //     const submissionMetaData = await tx.query.submissionMetaData.findMany({
    //         where: (submissionMetaData, {inArray}) => (
    //             inArray(submissionMetaData.id, submission?.submissionMetaDataIds as string[])
    //         ),
    //     });

    //     return {submission, submissionMetaData};
    // });
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
        .innerJoin(registered, eq(users.id, registered.userId))
        .where(eq(registered.name, courseName));

    return userList;
});
