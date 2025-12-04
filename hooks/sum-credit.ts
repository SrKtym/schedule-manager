'use client'

import { useRegisteredCourseDataList } from "@/contexts/registered-course-context";

export function sumCredit() {
    const dataList = useRegisteredCourseDataList();
    const creditList = dataList.courseDataList.map((data) => {
        return Number(data.course.credit)
    });
    const sum = creditList.reduce((prev, curr) => prev + curr, 0);
    return sum;
}
    
