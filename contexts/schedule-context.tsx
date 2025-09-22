'use client';

import { fetchRegisteredCourseData, fetchSchedule } from '@/utils/fetch';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const RegisteredContext = createContext<Awaited<ReturnType<typeof fetchRegisteredCourseData>>>([]);
const ScheduleContext = createContext<Awaited<ReturnType<typeof fetchSchedule>>>([]);

export const ScheduleProvider = ({ 
    children,
    registeredCourse,
    schedule
}: { 
    children: ReactNode,
    registeredCourse: Awaited<ReturnType<typeof fetchRegisteredCourseData>>,
    schedule?: Awaited<ReturnType<typeof fetchSchedule>>
}) => {
    const [registered, setRegistered] = useState(registeredCourse);
    const [savedSchedule, setSavedSchedule] = useState(schedule ?? []);

    useEffect(() => {
        setRegistered(registeredCourse);
        setSavedSchedule(schedule ?? []);
    }, [schedule, registeredCourse]);

    return (
        <RegisteredContext value={registered}>
            <ScheduleContext value={savedSchedule}>
                {children}
            </ScheduleContext>
        </RegisteredContext>
    );
};

export const useRegisteredCourseData = () => {
    const context = useContext(RegisteredContext);
    return context;
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    return context;
};