import { SearchField } from "@/components/private/register/search";
import { DataTable } from "@/components/private/register/data-table";
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
import { DataTableSkelton } from "@/components/skeltons";

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
        )
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
        <div className="flex flex-col space-y-5 lg:grid grid-cols-2 gap-x-5">
            <div className="space-y-5">
                <SearchField 
                    itemsLength={response[1]} 
                    rowsPerPage={params.rows || 10}
                />
                <Suspense fallback={<DataTableSkelton />}>
                    <DataTable 
                        items={response[0]}
                        totalPages={totalPages}   
                    />
                </Suspense>
            </div>
            <div>
                <Suspense fallback>
                    <Schedule />
                </Suspense>
            </div>
        </div>
    );
}