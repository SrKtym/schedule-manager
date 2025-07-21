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
import { getCourse, getItemsLength, getRegisteredCourse, getSession } from "@/lib/fetch";
import { Schedule } from "@/components/private/schedule/schedule";
import { Metadata } from "next";
import { DataTableSkelton, ScheduleSkelton } from "@/components/skeltons";
import { course } from "@/lib/drizzle/schema/public";

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
    const gradeList = params.grade?.split(',') ?? targetGrade;
    const facultyList = params.faculty?.split(',') ?? targetFaculty;
    const departmentList = params.department?.split(',') ?? targetDepartment();
    const weekList = params.week?.split(',') ?? week;
    const periodList = params.period?.split(',') ?? period;
    const creditList = params.credit?.split(',') ?? credit;
    const requiredList = params.required?.split(',') ?? required;
    const page = Number(params.page);
    const rows = Number(params.rows);
    const session = await getSession();
    const response = await Promise.allSettled([
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
        getRegisteredCourse(session)
    ])
    .then((dataList) => {
        const result = dataList.map((data) => {
            switch (data.status) {
                case 'fulfilled':
                    return data.value;
                case 'rejected':
                    if (data.reason instanceof Error)
                        return data.reason.message;
            }
        });
        return result;
    })

    const totalPages = Math.ceil(response[1] as number / (rows || 10)) || 1;

    return (
        <div className="flex flex-col space-y-5 lg:grid grid-cols-2 gap-x-5">
            <div className="space-y-5">
                <SearchField 
                    itemsLength={response[1] as number} 
                    rowsPerPage={rows || 10}
                />
                <Suspense fallback={<DataTableSkelton />}>
                    <DataTable 
                        items={response[0] as typeof course.$inferSelect[]}
                        totalPages={totalPages}
                        session={session}
                    />
                </Suspense>
            </div>
            <div>
                <Suspense fallback={<ScheduleSkelton />}>
                    <Schedule 
                        dataList={response[2] as Awaited<ReturnType<typeof getRegisteredCourse>>}
                        session={session}
                    />
                </Suspense>
            </div>
        </div>
    );
}