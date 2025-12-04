'use client';

import { 
    dateOptionforCalendar, 
    dateOptionforSchedule, 
    daysOfWeek, 
    hoursOfDay, 
    timeRange 
} from "@/constants/definitions";
import { Fragment, useContext, useState } from "react";
import { SidebarContext } from "@/contexts/sidebar-context";
import { Button, cn } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSchedule } from "@/contexts/schedule-context";
import { useRegisteredCourseDataList } from "@/contexts/registered-course-context";
import { CurrentTimeIndicator } from "./current-time-indicator";
import { 
    getDateFromTimeString, 
    getWeekDates, 
    timeSlots,  
    calculateWidthAsPercentage, 
    hexWithAlpha,
    isSpanningDays,
    calculateHeightAsPercentage
} from "@/utils/helpers/schedule";
import * as m from "motion/react-m";
import { 
    AnimatePresence, 
    LayoutGroup, 
    LazyMotion, 
    domAnimation 
} from "motion/react";
import { fetchSchedule } from "@/utils/getters/main";
import dynamic from "next/dynamic";

const SingleItemModal = dynamic(() => import("../shared-layout-modal"), { ssr: false });

export function BigCalendar({
    currentDate,
    selectedDate,
    setCurrentDate
}: {
    currentDate: Date;
    selectedDate: Date | undefined;
    setCurrentDate: (date: Date) => void;
}) {
    // コンテキストから取得
    const isCollapsed = useContext(SidebarContext);
    const {courseDataList} = useRegisteredCourseDataList();
    const schedule = useSchedule();
    
    const [selectedCourse, setSelectedCourse] = useState<{ 
        day: string, 
        start: Date, 
        end: Date, 
        name: string 
    } | false>(false);

    const [selectedSchedule, setSelectedSchedule] = useState<Awaited<ReturnType<typeof fetchSchedule>>[number] | false>(false);

    // 週の変更
    const changeWeek = (increment: number) => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + (7 * increment))));
    };
      
    const registeredCourse = courseDataList.map((data) => {
        return {
            day: data.course.week[0],
            start: getDateFromTimeString(timeRange[Number(data.course.period[0]) - 1].split("-")[0]),
            end: getDateFromTimeString(timeRange[Number(data.course.period[0]) - 1].split("-")[1]),
            name: data.course.name
        }
    });

    // 1日の講義を取得
    const dailyCourse = (day: string) => {
        const dailyCourseList = registeredCourse.filter(v => v.day === day);
        return dailyCourseList;
    }
    // 1日のスケジュールを取得
    const dailySchedule = (date: Date) => {
        const newDate = new Date(date);
        newDate.setHours(23, 59, 0, 0);

        // スケジュール（終日、または日を跨ぐもの）を取得
        const scheduleList = schedule.filter(v => 
            v.start <= newDate && date <= v.end
        );

        // 日曜日以外の日付なら、1日のスケジュールを返す
        if (date.getDay() !== 0) {
            const oneDayScheduleList = scheduleList.filter(
                v => v.start.getDate() === date.getDate()
            );
            return oneDayScheduleList;
        }

        return scheduleList;
    }

    const weekDates = getWeekDates(currentDate);

    return (
        <div className={cn("flex-1 border-l border-gray-200 px-4 pb-4", 
            isCollapsed ? undefined : "max-sm:blur-lg"
        )}>
            <div className="flex justify-between items-center mb-4 pt-4 bg-background sticky z-10 top-15">
                <h2 className="text-2xl">
                    {`${weekDates[0].toLocaleDateString('default', dateOptionforCalendar)} 
                    - ${weekDates[6].toLocaleDateString('default', dateOptionforCalendar)}`}
                </h2>
                <div className="flex gap-2">
                    <Button 
                        aria-label="prev week"
                        isIconOnly 
                        variant="light" 
                        onPress={() => changeWeek(-1)}
                    >
                        <ChevronLeft width={24} />
                    </Button>
                    <Button 
                        aria-label="next week"
                        isIconOnly 
                        variant="light" 
                        onPress={() => changeWeek(1)}
                    >
                        <ChevronRight width={24} />
                    </Button>
                </div>
            </div>
            <div className="relative grid grid-cols-8 p-4 rounded-large shadow-small dark:bg-content1">
                <div className="sticky top-29 mb-2 z-10 bg-white dark:bg-content1 max-[415px]:top-35" />
                {daysOfWeek.map((day, index) => (
                    <div 
                        key={day} 
                        className={cn("flex justify-center border-b border-gray-300 sticky top-29 z-10 text-center py-2 bg-white dark:bg-content1 max-[415px]:top-35",
                            selectedDate?.toString() === weekDates[index].toString() ? 
                            "bg-gray-200 dark:bg-gray-800" : undefined
                        )}
                    >
                        <div className={cn("flex flex-col items-center justify-center w-[48px] gap-1 rounded-full",
                            new Date().toLocaleDateString('default') === weekDates[index].toLocaleDateString('default') ? 
                            "bg-sky-500/50" : undefined
                        )}>
                            {/* 曜日 */}
                            <div className={
                                day === "日" ? 
                                "text-orange-800 dark:text-orange-500" : day === "土" ? 
                                "text-primary-500" : undefined
                            }>
                                {day}
                            </div>
                            {/* 日付 */}
                            <p>
                                {weekDates[index].getDate()}
                            </p>
                        </div>
                    </div>
                ))}
                <LazyMotion features={domAnimation}>
                    <div className="col-span-full relative -top-2">
                        <CurrentTimeIndicator />
                    </div>
                    <LayoutGroup>
                        <AnimatePresence>
                            {hoursOfDay.map((hour) => (
                                <Fragment key={hour}>
                                    {/* 時刻 */}
                                    <div className="relative border-r border-gray-300 text-right h-12 pr-2 max-lg:text-xs">
                                        <p className="absolute -top-3 right-1 max-lg:-top-2">
                                            {timeSlots(hour)}
                                        </p>
                                    </div>
                                    {/* 表 */}
                                    {daysOfWeek.map((day, index) => (
                                        <div 
                                            key={`${day}-${hour}`} 
                                            className="relative text-center border-r border-b border-gray-300 h-12"
                                        >
                                            {/* 1日の講義 */}
                                            {dailyCourse(day).map((course) => (
                                                course.start.getHours() === hour && 
                                                    <m.div
                                                        key={course.name}
                                                        layoutId={course.name}
                                                        style={{
                                                            height: calculateHeightAsPercentage(course.start, course.end),
                                                            width: calculateWidthAsPercentage(course.start, course.end, weekDates[0]),
                                                            top: `${course.start.getMinutes() / 60 * 100}%`,
                                                        }}
                                                        className="absolute inset-0 bg-primary/80 z-5 mx-1 rounded-medium cursor-pointer hover:z-6"
                                                        onClick={() => setSelectedCourse(course)}
                                                    >
                                                        <div className="flex flex-col items-start gap-1 m-1 truncate text-sm max-lg:text-xs">
                                                            <p>
                                                                {course.name}
                                                            </p>
                                                            <p>
                                                                {course.start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} 
                                                                - 
                                                                {course.end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </m.div>
                                            ))} 
                                            {/* 1日の予定 */}
                                            {dailySchedule(weekDates[index]).map((schedule) => (
                                                schedule.start.getHours() === hour && 
                                                    <m.div
                                                        key={`${schedule.id}`}
                                                        layoutId={`${schedule.id}`}
                                                        style={{
                                                            height: calculateHeightAsPercentage(schedule.start, schedule.end),
                                                            width: calculateWidthAsPercentage(schedule.start, schedule.end, weekDates[0]),
                                                            top: `${schedule.start.getMinutes() / 60 * 100}%`,
                                                            backgroundColor: hexWithAlpha(schedule.color, 0.8),
                                                        }}
                                                        className="absolute inset-0 h-full z-5 mx-1 rounded-medium cursor-pointer hover:z-6"
                                                        onClick={() => setSelectedSchedule(schedule)}
                                                    >
                                                        <div className="flex flex-col items-start gap-1 m-1 truncate text-sm max-lg:text-xs">
                                                            <p>
                                                                {schedule.title}
                                                            </p>
                                                            <p>
                                                                {isSpanningDays(schedule.start, schedule.end) ? 
                                                                    `${schedule.start.toLocaleDateString('default', dateOptionforSchedule)} - ${schedule.end.toLocaleDateString('default', dateOptionforSchedule)}` : 
                                                                    `${schedule.start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} - ${schedule.end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}`}
                                                            </p>
                                                        </div>
                                                    </m.div> 
                                            ))}
                                        </div>
                                    ))}
                                </Fragment>
                            ))}
                            {selectedCourse && (
                                <SingleItemModal 
                                    key="modal"
                                    registeredCourse={selectedCourse}
                                    onClose={() => setSelectedCourse(false)}
                                />
                            )}
                            {selectedSchedule && (
                                <SingleItemModal 
                                    key="modal"
                                    schedule={selectedSchedule}
                                    onClose={() => setSelectedSchedule(false)}
                                />
                            )}
                        </AnimatePresence>
                    </LayoutGroup>
                </LazyMotion>
            </div>
        </div>
    );
}