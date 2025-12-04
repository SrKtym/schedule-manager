import type { Metadata } from "next";
import { Overall } from "@/components/home/course-list/overall";
import { fetchSession } from "@/utils/getters/auth";
import { fetchRegisteredCourseData } from "@/utils/getters/main";
import { RegisteredCourseProvider } from "@/contexts/registered-course-context";

export const metadata: Metadata = {
    title: '登録済みの講義'
}

export default async function CourseListPage() {
    const session = await fetchSession();
    const registeredCourseData = await fetchRegisteredCourseData(session);
    return (
        <RegisteredCourseProvider courseDataList={registeredCourseData}>
            <Overall />
        </RegisteredCourseProvider>
    )
}