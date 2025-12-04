import type { Metadata } from "next";
import { Overall } from "@/components/home/schedule/overall";
import { fetchSession } from "@/utils/getters/auth";
import { fetchRegisteredCourseData, fetchSchedule } from "@/utils/getters/main";
import { ScheduleProvider } from "@/contexts/schedule-context";
import { RegisteredCourseProvider } from "@/contexts/registered-course-context";


export const metadata: Metadata = {
    title: 'スケジュール'
}

export default async function SchedulePage() {
    const session = await fetchSession();
    const [registeredCourse, schedule] = await Promise.allSettled([
        fetchRegisteredCourseData(session),
        fetchSchedule(session)
    ]);
    const registeredCourseValue = registeredCourse.status === 'fulfilled' ? registeredCourse.value : [];
    const scheduleValue = schedule.status === 'fulfilled' ? schedule.value : [];

    return (
        <RegisteredCourseProvider courseDataList={registeredCourseValue}>
            <ScheduleProvider schedule={scheduleValue}>
                <Overall />
            </ScheduleProvider>
        </RegisteredCourseProvider>
    );
}