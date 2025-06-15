import { db } from "./db";
import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { cache } from "react";


export const getSession = cache(async () => {
    const settionData = await auth.api.getSession({
        headers: await headers()
    });
    return settionData;
});

export async function get2faCookie() {
    const cookieStore = await cookies();
    return cookieStore.get('better-auth.two_factor')?.value;
}

export async function getThemeCookie() {
    const cookieStore = await cookies();
    return cookieStore.get('theme')?.value || 'light';
}

export const getCourse = cache(async (
    gradeList: string[], 
    facultyList: string[],
    departmentList: string[],
    weekList: string[],
    periodList: string[],
    creditList: string[],
    requiredList: string[],
    query?: string,
    page?: number,
    rows?: number
) => {
    const result = await db.query.course.findMany({
        where: (course, {or, and, inArray, ilike}) => 
            or(
                and(
                    inArray(course.targetGrade, gradeList as []),
                    inArray(course.targetFaculty, facultyList as []),
                    inArray(course.targetDepartment, departmentList as []),
                    inArray(course.week, weekList as []),
                    inArray(course.period, periodList as []),
                    inArray(course.credit, creditList as []),
                    inArray(course.required, requiredList as [])
                ),
                ilike(course.name, `%${query}%`),
                ilike(course.professor, `%${query}%`)
            ),
        limit: rows || 10,
        offset: ((page || 1) - 1) * (rows || 10)
    });
    return result;
});

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
        where: (course, {or, and, inArray, ilike}) => 
            or(
                and(
                    inArray(course.targetGrade, gradeList as []),
                    inArray(course.targetFaculty, facultyList as []),
                    inArray(course.targetDepartment, departmentList as []),
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

export const getRegisteredCourse = cache(async () => {
    const settion = await getSession();
    const result = await db.query.registered.findMany({
        where: (registered, {eq}) => (eq(registered.email, settion?.user.email ?? ''))
    });
    return result;
});
