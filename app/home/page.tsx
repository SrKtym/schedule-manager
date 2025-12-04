import type { Metadata } from "next";
import { NotificationsList } from "@/components/home/notifications-list";
import { DailySchedule } from "@/components/home/daily-schedule";
import { UpcomingAssignment } from "@/components/home/upcoming-assignment";
import { AssignmentProgress } from "@/components/home/assignment-progress";
import { fetchSession } from "@/utils/getters/auth";
import { fetchAssignmentData, fetchRegisteredCourseData, fetchSchedule } from "@/utils/getters/main";
import { RegisteredCourseProvider } from "@/contexts/registered-course-context";
import { ScheduleProvider } from "@/contexts/schedule-context";
import { AssignmentDataProvider } from "@/contexts/assignment-data-context";

export const metadata: Metadata = {
    title: 'ホーム'
}

export default async function HomePage() {
    const session = await fetchSession();
    const registeredCourseData = await fetchRegisteredCourseData(session);
    const registeredCourseNameList = registeredCourseData.map((data) => data.course.name);
    const [assignmentData, schedule] = await Promise.allSettled([
        fetchAssignmentData(session, registeredCourseNameList),
        fetchSchedule(session),
    ]);
    const assignmentDataValue = assignmentData.status === 'fulfilled' ? assignmentData.value : [];
    const scheduleValue = schedule.status === 'fulfilled' ? schedule.value : [];
    const todaySchedule = scheduleValue.filter(
        schedule => schedule.start.toDateString() === new Date().toDateString()
    );

    return (
        <div className="grid grid-cols-1 sm:grid-flow-col grid-rows-3 auto-cols-fr gap-6 p-3">
            <RegisteredCourseProvider courseDataList={registeredCourseData}>
                <ScheduleProvider schedule={scheduleValue}>
                    <DailySchedule todaySchedule={todaySchedule} />
                </ScheduleProvider>
            </RegisteredCourseProvider>
            <NotificationsList  />
            <AssignmentDataProvider assignmentData={assignmentDataValue}>
                <UpcomingAssignment />
                <AssignmentProgress />
            </AssignmentDataProvider>
        </div>
    );
}