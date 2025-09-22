'use client';

import { Sidebar } from "./sidebar";
import { BigCalendar } from "./big-calendar";
import { useState } from "react";

export function WeeklySchedule() {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <div className="flex">
            {/* サイドバー */}
            <Sidebar 
                setCurrentDate={setCurrentDate}
                setSelectedDate={setSelectedDate}
            />
            {/* カレンダー（大） */}
            <BigCalendar 
                currentDate={currentDate}
                selectedDate={selectedDate}
                setCurrentDate={setCurrentDate}
            />
        </div>
    );
}