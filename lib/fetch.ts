// データ取得のみ

import { db } from "./drizzle";
import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { course, registered } from "./drizzle/schema/public";
import { eq } from "drizzle-orm";


export const getSession = cache(async () => {
    const settionData = await auth.api.getSession({
        headers: await headers()
    });
    return settionData;
});

export async function get2faCookie() {
    const cookieStore = await cookies();
    const cookieName = process.env.NODE_ENV === 'development' ?
        'better-auth.two_factor' : 
        '__Secure-better-auth.two_factor';
    return cookieStore.get(cookieName)?.value;
}

export async function getThemeCookie() {
    const cookieStore = await cookies();
    return cookieStore.get('theme')?.value || 'light';
}

// 講義一覧の取得
export const getCourse = cache(async (
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
export const getItemsLength = cache(async (
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

// 登録済みの講義を取得
export const getRegisteredCourse = cache(async (session: Awaited<ReturnType<typeof getSession>>) => {   
    const result = await db
        .select({
            course: {
                name: course.name,
                period: course.period,
                week: course.week,
                credit: course.credit
            }})
        .from(registered)
        .innerJoin(course, eq(course.name, registered.name))
        .where(eq(registered.email, session?.user.email as string))

    return result;     
});
