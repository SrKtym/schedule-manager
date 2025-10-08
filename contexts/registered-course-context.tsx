'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchRegisteredCourseData } from '@/utils/getter';

const RegisteredCourseContext = createContext<{
    courseDataList: (Awaited<ReturnType<typeof fetchRegisteredCourseData>>[number] & {
        coverImage: string
    })[]
}>({
    courseDataList: []
});

export const RegisteredCourseProvider = ({ 
    children,
    courseDataList
}: { 
    children: ReactNode,
    courseDataList: Awaited<ReturnType<typeof fetchRegisteredCourseData>>
}) => {
    const registeredCourseDataList = courseDataList.map((registered, index) => {
        return {
            ...registered,
            coverImage: `https://img.heroui.chat/image/landscape?w=800&h=200&u=${index + 1}`
        }
    });
    const [currentCourseDataList, setCurrentCourseDataList] = useState(registeredCourseDataList);

    useEffect(() => {
        setCurrentCourseDataList(registeredCourseDataList);
    }, [courseDataList]);
    
    return (
        <RegisteredCourseContext value={{
            courseDataList: currentCourseDataList
        }}>
            {children}
        </RegisteredCourseContext>
    );
};

export const useRegisteredCourseData = () => {
    const courseDataList = useContext(RegisteredCourseContext);
    return courseDataList;
};

export const useCurrentCourseData = (courseName: string) => {
    const {courseDataList} = useContext(RegisteredCourseContext);
    const number = courseDataList.findIndex((data) => data.course.name === courseName);
    return courseDataList[number];
};

