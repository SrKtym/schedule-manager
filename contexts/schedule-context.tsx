'use client';

import { fetchSchedule } from '@/utils/getters/main';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const ScheduleContext = createContext<Awaited<ReturnType<typeof fetchSchedule>>>([]);

export const ScheduleProvider = ({ 
    children,
    schedule
}: { 
    children: ReactNode,
    schedule?: Awaited<ReturnType<typeof fetchSchedule>>
}) => {
    const [savedSchedule, setSavedSchedule] = useState(schedule ?? []);

    useEffect(() => {
        setSavedSchedule(schedule ?? []);
    }, [schedule]);

    return (
        <ScheduleContext value={savedSchedule}>
            {children}
        </ScheduleContext>
    );
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    return context;
};