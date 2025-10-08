import type { Metadata } from "next";
import { Overall } from "@/components/home/schedule/overall";
import { fetchSchedule, getSession } from "@/utils/getter";
import { ScheduleProvider } from "@/contexts/schedule-context";


export const metadata: Metadata = {
    title: 'スケジュール'
}

export default async function SchedulePage() {
    const session = await getSession();
    const schedule = await fetchSchedule(session);

    return (
        <ScheduleProvider schedule={schedule}>
            <Overall />
        </ScheduleProvider>
    );
}