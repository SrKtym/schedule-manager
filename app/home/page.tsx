import type { Metadata } from "next";
import { NotificationsList } from "@/components/home/notifications-list";
import { DailySchedule } from "@/components/home/daily-schedule";
import { UpcomingAssignment } from "@/components/home/upcoming-assignment";
import { AssignmentProgress } from "@/components/home/assignment-progress";
import { getSession } from "@/utils/getter";
import { fetchSchedule } from "@/utils/getter";

export const metadata: Metadata = {
    title: 'ホーム'
}

export default async function HomePage() {
    const session = await getSession();
    const schedule = await fetchSchedule(session) ?? [];
    const todaySchedule = schedule.filter(
        schedule => schedule.start.toDateString() === new Date().toDateString()
    );

    return (
        <div className="grid grid-cols-1 sm:grid-flow-col grid-rows-3 auto-cols-fr gap-6 p-3">
            <DailySchedule todaySchedule={todaySchedule} />
            <NotificationsList />
            <UpcomingAssignment />
            <AssignmentProgress />
        </div>
    );
}