import { DataTable } from "@/components/private/register/data-table";
import { Spinner } from "@heroui/spinner";
import { Suspense } from "react";
import { targetGrade, targetFaculty, targetDepartment } from "@/lib/definitions";
import { getCourse, getRegisteredCourse } from "@/lib/fetch";
import { Schedule } from "@/components/private/schedule/schedule";

export default async function Page(
    props: {
        searchParams: Promise<{
            grade?: string,
            faculty?: string,
            department?: string,
            query?: string
        }>
    }   
) {
    const params = await props.searchParams;
    const gradeList = params.grade?.split(',') ?? targetGrade;
    const facultyList = params.faculty?.split(',') ?? [...targetFaculty, ...[]];
    const departmentList = params.department?.split(',') ?? [...targetDepartment, ...[]];
    const response = await Promise.allSettled([
        getCourse(gradeList, facultyList, departmentList, params.query),
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

    return (
        <div className="grid gap-5 sm:grid-cols-2 gap-5">
            <Suspense fallback={
                <Spinner classNames={{label: "text-foreground mt-4"}} label="読み込み中…" variant="wave"/>
            }>
                <DataTable items={response[0]}/>
                <Schedule registeredCourse={response[1]}/>
            </Suspense>
        </div>
    );
}