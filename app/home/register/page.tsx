import { SearchField } from "@/components/home/register/search";
import { DataTable } from "@/components/home/register/data-table";
import { Suspense } from "react";
import { 
    grade,
    faculty,
    department,
    week, 
    period, 
    credit, 
    required, 
    filteredStructure
} from "@/constants/definitions";
import { 
    fetchCourse, 
    fetchItemsLength,
    fetchRegisteredCourseData
} from "@/utils/getters/main";
import { Timetable } from "@/components/home/register/timetable";
import type { Metadata } from "next";
import { 
    DataTableSkelton, 
    FilterSkelton, 
    TimeTableSkelton 
} from "@/components/skeltons";
import { filterByParams, objectValues } from "@/utils/helpers/register";
import { Filter } from "@/types/main/regisered-course";
import { fetchSession } from "@/utils/getters/auth";
import { RegisteredCourseProvider } from "@/contexts/registered-course-context";


export const metadata: Metadata = {
    title: '履修登録'
}

export default async function RegisterPage(
    props: {
        searchParams: Promise<{
            grade?: string,
            faculty?: string,
            department?: string,
            week?: string,
            period?: string,
            credit?: string,
            page?: string,
            query?: string,
            required?: string,
            rows?: string
        }>
    }   
) {
    const session = await fetchSession();
    const params = await props.searchParams;
    const page = Number(params.page);
    const rows = Number(params.rows);

    // ページ番号・表示件数・検索文字列以外のパラメータの値
    const paramValues = Object.entries(params).flatMap(([key, value]) => {
        const keys = Object.keys(filteredStructure)
            .filter((key): key is keyof typeof filteredStructure => !!key);
        const paramName = keys.find((name) => name === key);

        if (!paramName) return [];

        const paramValue = objectValues(filteredStructure, paramName);
        const values = value
            .split(',')
            .filter((value): value is typeof paramValue[number] => !!value);
        
        return values;

    });
    const gradeList = filterByParams(paramValues, grade);
    const facultyList = filterByParams(paramValues, faculty);
    const departmentList = filterByParams(paramValues, department["全学部"]);
    const weekList = filterByParams(paramValues, week);
    const periodList = filterByParams(paramValues, period);
    const creditList = filterByParams(paramValues, credit);
    const requiredList = filterByParams(paramValues, required);
    const filter: Filter = {
        gradeList,
        facultyList,
        departmentList,
        weekList,
        periodList,
        creditList,
        requiredList
    };
    const [course, itemsLength, registeredCourse] = await Promise.allSettled([
        fetchCourse(
            filter,
            page,
            rows,
            params.query
        ),
        fetchItemsLength(
            filter,
            params.query
        ),
        fetchRegisteredCourseData(session)
    ]);

    const courseValue = course.status === 'fulfilled' ? course.value : [];
    const itemsLengthValue = itemsLength.status === 'fulfilled' ? itemsLength.value : 0;
    const registeredCourseValue = registeredCourse.status === 'fulfilled' ? registeredCourse.value : [];
    const totalPages = Math.ceil(itemsLengthValue / (rows || 10));

    return (
        <div className="flex flex-col space-y-5 lg:grid grid-cols-2 gap-x-5 p-3">
            <div className="space-y-5">
                <Suspense fallback={<FilterSkelton />}>
                    <SearchField 
                        itemsLength={itemsLengthValue} 
                        rowsPerPage={rows || 10}
                    />
                </Suspense>
                <Suspense fallback={<DataTableSkelton />}>
                    <DataTable 
                        items={courseValue}
                        totalPages={totalPages}
                    />
                </Suspense>
            </div>
            <div>
                <Suspense fallback={<TimeTableSkelton />}>
                    <RegisteredCourseProvider courseDataList={registeredCourseValue}>
                        <Timetable />
                    </RegisteredCourseProvider>
                </Suspense>
            </div>
        </div>
    )
}