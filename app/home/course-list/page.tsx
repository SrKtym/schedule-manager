import type { Metadata } from "next";
import { getSession, fetchRegisteredCourseData } from "@/utils/fetch";
import { Overall } from "@/components/home/course-list/overall";

export const metadata: Metadata = {
    title: '登録済みの講義'
}

export default async function CourseListPage() {
    const session = await getSession();
    const courseDataList = await fetchRegisteredCourseData(session);

    return <Overall courseDataList={courseDataList}/>
}