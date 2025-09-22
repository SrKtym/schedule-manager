'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fetchRegisteredCourseData } from '@/utils/fetch';

const RegisteredCourseContext = createContext<{
    courseDataList: Awaited<ReturnType<typeof fetchRegisteredCourseData>> & {
        coverImage: string;
    }[],
    courseName?: string
}>({
    courseDataList: [],
    courseName: undefined
});

export const RegisteredCourseProvider = ({ 
    children,
    courseDataList,
    courseName
}: { 
    children: ReactNode,
    courseDataList: Awaited<ReturnType<typeof fetchRegisteredCourseData>>
    courseName?: string
}) => {
    const registeredCourseDataList = courseDataList.map((registered, index) => {
        return {
            ...registered,
            coverImage: `https://img.heroui.chat/image/landscape?w=800&h=200&u=${index + 1}`
        }
    });
    const [currentCourseDataList, setCurrentCourseDataList] = useState(registeredCourseDataList);
    
    return (
        <RegisteredCourseContext value={{
            courseDataList: currentCourseDataList,
            courseName
        }}>
            {children}
        </RegisteredCourseContext>
    );
};

export const useCurrentCourseData = () => {
    const {courseDataList, courseName} = useContext(RegisteredCourseContext);
    const number = courseDataList.findIndex((data) => data.course.name === courseName);
    return courseDataList[number];
};

