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

export const getTheme = cache(async () => {
    const session = await getSession();
    const user = await db.query.users.findFirst({
        with: {
            settings: true
        },
        where: (users, {eq}) => (eq(users.id, session?.session.userId ?? ''))
    });
    
    return user?.settings[0].theme ?? 'light';
})

export async function get2faCookie() {
    const cookieStore = await cookies();
    return cookieStore.get('better-auth.two_factor')?.value
}

export const getCourse = cache(async (
    gradeList: string[], 
    facultyList: string[],
    departmentList: string[],
    query?: string
) => {
    const result = await db.query.course.findMany({
        where: (course, {or, and, inArray, ilike, sql}) => 
            or(
                and(
                    inArray(course.targetGrade, gradeList as []),
                    inArray(course.targetFaculty, facultyList as []),
                    inArray(course.targetDepartment, departmentList as []),
                ),
                ilike(course.name, `%${query}%`),
                ilike(course.professor, `%${query}%`),
                ilike(course.textbooks, `%${query}%`)
            )  
    });
    return result;
});

export const getRegisteredCourse = cache(async () => {
    const settion = await getSession();
    const result = await db.query.registered.findMany({
        where: (registered, {eq}) => (eq(registered.email, settion?.user.email ?? ''))
    });
    return result;
});
