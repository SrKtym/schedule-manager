'use client'

import { useRegisteredCourseData } from "@/contexts/schedule-context";

export function sumCredit() {
    const dataList = useRegisteredCourseData();
    const creditList = dataList.map((data) => {return Number(data.course.credit)});
    const sum = creditList.reduce((prev, curr) => prev + curr, 0);
    return sum;
}
    
