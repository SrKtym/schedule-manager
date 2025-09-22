import { SearchField } from "@/components/home/register/search";
import { DataTable } from "@/components/home/register/data-table";
import { Suspense } from "react";
import { 
    targetGrade, 
    targetFaculty, 
    week, 
    period, 
    credit, 
    required 
} from "@/constants/definitions";
import { targetDepartment } from "@/utils/related-to-register";
import { 
    fetchRegisteredCourseData,
    getCourse, 
    getItemsLength,  
    getSession 
} from "@/utils/fetch";
import { Timetable } from "@/components/home/register/timetable";
import type { Metadata } from "next";
import { 
    DataTableSkelton, 
    FilterSkelton, 
    TimeTableSkelton 
} from "@/components/skeltons";
import { ScheduleProvider } from "@/contexts/schedule-context";


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
    const params = await props.searchParams;
    const gradeList = params.grade?.split(',') ?? [...targetGrade];
    const facultyList = params.faculty?.split(',') ?? [...targetFaculty];
    const departmentList = params.department?.split(',') ?? [...targetDepartment()];
    const weekList = params.week?.split(',') ?? [...week];
    const periodList = params.period?.split(',') ?? [...period];
    const creditList = params.credit?.split(',') ?? [...credit];
    const requiredList = params.required?.split(',') ?? [...required];
    const page = Number(params.page);
    const rows = Number(params.rows);
    const session = await getSession();
    const [course, itemsLength, registeredCourseData] = await Promise.allSettled([
        getCourse(
            gradeList, 
            facultyList, 
            departmentList,
            weekList,
            periodList,
            creditList,
            requiredList,
            page, 
            rows,
            params.query
        ),
        getItemsLength(
            gradeList,
            facultyList,
            departmentList,
            weekList,
            periodList,
            creditList,
            requiredList,
            params.query
        ),
        fetchRegisteredCourseData(session)
    ]);

    const courseValue = course.status === 'fulfilled' ? course.value : [];
    const itemsLengthValue = itemsLength.status === 'fulfilled' ? itemsLength.value : 0;
    const registeredCourseValue = registeredCourseData.status === 'fulfilled' ? registeredCourseData.value : [];
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
                    <ScheduleProvider registeredCourse={registeredCourseValue}>
                        <Timetable />
                    </ScheduleProvider>
                </Suspense>
            </div>
        </div>
    )
}