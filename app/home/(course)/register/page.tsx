import { SearchField } from "@/components/private/register/search";
import { DataTable } from "@/components/private/register/data-table";
import { Skeleton } from "@heroui/react";
import { Suspense } from "react";
import { 
    targetGrade, 
    targetFaculty, 
    targetDepartment, 
    week, 
    period, 
    credit, 
    required 
} from "@/lib/definitions";
import { getCourse, getItemsLength, getRegisteredCourse } from "@/lib/fetch";
import { Schedule } from "@/components/private/schedule/schedule";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '履修登録'
}

export default async function Page(
    props: {
        searchParams: Promise<{
            grade?: string,
            faculty?: string,
            department?: string,
            week?: string,
            period?: string,
            credit?: string,
            page?: number
            query?: string,
            required?: string,
            rows?: number
        }>
    }   
) {
    const params = await props.searchParams;
    const gradeList = params.grade?.split(',') ?? targetGrade;
    const facultyList = params.faculty?.split(',') ?? targetFaculty;
    const departmentList = params.department?.split(',') ?? targetDepartment();
    const weekList = params.week?.split(',') ?? week;
    const periodList = params.period?.split(',') ?? period;
    const creditList = params.credit?.split(',') ?? credit;
    const requiredList = params.required?.split(',') ?? required;
    const response = await Promise.allSettled([
        getCourse(
            gradeList, 
            facultyList, 
            departmentList,
            weekList,
            periodList,
            creditList,
            requiredList,
            params.query,
            params.page, 
            params.rows
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
        getRegisteredCourse()
    ])
    .then((dataList) => {
        const result = dataList.map((data) => {
            switch (data.status) {
                case 'fulfilled':
                    return data.value;
                case 'rejected':
                    return data.reason;
            }
        });
        return result;
    })

    const totalPages = Math.ceil(response[1] / (params.rows || 10)) || 1;

    return (
        <div className="grid gap-x-5 lg:grid-cols-2 gap-y-5">
            <div className="space-y-5">
                <SearchField 
                    itemsLength={response[1]} 
                    rowsPerPage={params.rows || 10}
                />
                <Suspense fallback={
                    <Skeleton className="rounded-lg">
                        <div>

                        </div>
                    </Skeleton>
                }>
                    <DataTable 
                        items={response[0]}
                        totalPages={totalPages}   
                    />
                </Suspense>
            </div>
            <div className="flex items-center">
                <Suspense fallback>
                    <Schedule 
                        registeredCourse={response[2]}
                    />
                </Suspense>
            </div>
        </div>
    );
}