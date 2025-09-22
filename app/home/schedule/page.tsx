import type { Metadata } from "next";
import { Overall } from "@/components/home/schedule/overall";
import { fetchRegisteredCourseData, fetchSchedule, getSession } from "@/utils/fetch";
import { ScheduleProvider } from "@/contexts/schedule-context";


export const metadata: Metadata = {
    title: 'スケジュール'
}

export default async function SchedulePage() {
    const session = await getSession();
    const [registeredCourseData, schedule] = await Promise.allSettled([
        fetchRegisteredCourseData(session),
        fetchSchedule(session)
    ]);
    const registeredCourseValue = registeredCourseData.status === 'fulfilled' ? registeredCourseData.value : [];
    const scheduleValue = schedule.status === 'fulfilled' ? schedule.value : [];

    return (
        <ScheduleProvider 
            registeredCourse={registeredCourseValue}
            schedule={scheduleValue}
        >
            <Overall />
        </ScheduleProvider>
    );
}