import type { Metadata } from "next";
import { Overall } from "@/components/home/schedule/overall";
import { fetchSchedule, fetchSession } from "@/utils/getter";
import { ScheduleProvider } from "@/contexts/schedule-context";


export const metadata: Metadata = {
    title: 'スケジュール'
}

export default async function SchedulePage() {
    const session = await fetchSession();
    const schedule = await fetchSchedule(session);

    return (
        <ScheduleProvider schedule={schedule}>
            <Overall />
        </ScheduleProvider>
    );
}