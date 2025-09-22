'use client';

import { 
    dateOptionforCalendar, 
    daysOfWeek, 
    hoursOfDay, 
    timeRange 
} from "@/constants/definitions";
import { Fragment, useContext } from "react";
import { SidebarContext } from "@/contexts/sidebar-context";
import { cn } from "@heroui/react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSchedule } from "@/contexts/schedule-context";
import { useRegisteredCourseData } from "@/contexts/schedule-context";

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
    const dataList = useRegisteredCourseData();
    const schedule = useSchedule();

    const getDateFromTimeString = (timeStr: string) => {
        const [hours, minutes] =  timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date
    }
    
    const getWeekDates = (date: Date) => {
        const week = [];
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
    
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }
        return week;
    };
    
    const changeWeek = (increment: number) => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + (7 * increment))));
    };
    
    const timeSlots = (h: number) => {
        const slot: string[] = [];
        const date = new Date();
        date.setSeconds(0);
        date.setMilliseconds(0);
        
        for (let m = 0; m < 60; m += 60) {
            const time = new Date(date);
                time.setHours(h, m) ;
                slot.push(time.toLocaleTimeString('default', {
                    hour: '2-digit',
                    minute: '2-digit'
                }));
            }
        
        return slot;
    };
    
    const registeredCourse = dataList.map((data) => {
        return {
            day: data.course.week[0],
            start: getDateFromTimeString(timeRange[Number(data.course.period[0]) - 1].split("-")[0]),
            end: getDateFromTimeString(timeRange[Number(data.course.period[0]) - 1].split("-")[1]),
            title: data.course.name
        }
    });

    const courseOfDay = (d: string) => {
        const res = registeredCourse.filter(v => v.day === d);
        return res;
    }
    const scheduleOfDay = (date: string) => {
        const res = schedule.filter(v => 
            v.schedule.start.toLocaleDateString('default') === date
        );
        return res;
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
            <div className="grid grid-cols-8 p-4 rounded-lg shadow dark:bg-content1">
                <div className="sticky top-29 z-10 bg-white dark:bg-content1 max-[415px]:top-35" />
                {daysOfWeek.map((day, index) => (
                    <div 
                        key={day} 
                        className={cn("flex justify-center border-b border-gray-300 sticky top-29 z-10 text-center py-2 bg-white dark:bg-content1 max-[415px]:top-35",
                            selectedDate?.toString() === weekDates[index].toString() ? 
                            "bg-gray-200 dark:bg-gray-800" : undefined
                        )}
                    >
                        <div className={cn("flex flex-col items-center justify-center w-[48px] gap-1 rounded-full",
                            new Date().toLocaleDateString('default', dateOptionforCalendar) === 
                            weekDates[index].toLocaleDateString('default', dateOptionforCalendar) ? 
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
                {hoursOfDay.map((hour) => (
                    // <></>と同義
                    <Fragment key={hour}>
                        <div className="border-r border-gray-300 text-right h-12 pr-2 max-lg:text-sm">
                            {timeSlots(hour)}
                        </div>
                        {daysOfWeek.map((day, index) => (
                            <div 
                                key={`${day}-${hour}`} 
                                className="relative text-center border-r border-gray-300 h-12"
                            >
                                <div className="absolute w-full border-b border-gray-300 bottom-0"/>
                                {/* 1日の講義 */}
                                {courseOfDay(day).map((course) => (
                                    <div
                                        key={course.title}
                                        style={{
                                            height: course.start.getHours() === hour ?
                                                `${(60 - course.start.getMinutes()) / 60 * 100}%` :
                                                course.end.getHours() === hour ?
                                                `${(course.end.getMinutes()) / 60 * 100}%` :
                                                undefined,
                                            top: course.start.getHours() === hour ?
                                                `${course.start.getMinutes() / 60 * 100}%` :
                                                undefined
                                        }}
                                        className={cn(course.start.getHours() <= hour && hour <= course.end.getHours() ? 
                                            "absolute w-full h-full bg-primary backdrop-blur-lg hover:cursor-pointer z-5" : undefined,
                                            course.start.getHours() === hour ? "z-8" : undefined
                                        )}
                                    >
                                        {course.start.getHours() === hour ? course.title : null}
                                    </div> 
                                ))}
                                {/* 1日の予定 */}
                                {scheduleOfDay(weekDates[index].toLocaleDateString('default')).map(({schedule}) => (
                                    <div
                                        key={`${schedule.id}`}
                                        style={{
                                            height: schedule.start.getHours() === hour ? 
                                                `${((60 - schedule.start.getMinutes()) / 60 ) * 100}%` :
                                                schedule.end.getHours() === hour ?
                                                `${(schedule.end.getMinutes()) / 60 * 100}%` : 
                                                undefined,
                                            top: schedule.start.getHours() === hour ? 
                                                `${schedule.start.getMinutes() / 60 * 100}%` : 
                                                undefined,
                                            backgroundColor: schedule.color
                                        }}
                                        className={cn(schedule.start.getHours() <= hour && hour <= schedule.end.getHours() ?
                                            "absolute w-full h-full backdrop-blur-lg z-5 overflow-visible hover:cursor-pointer" : 
                                            undefined,
                                            schedule.start.getHours() === hour ? 
                                            "z-8" : 
                                            undefined
                                        )} 
                                    >
                                        {schedule.start.getHours() === hour ? schedule.title : null}
                                    </div> 
                                ))}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}