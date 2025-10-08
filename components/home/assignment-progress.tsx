'use client';

import { Progress } from "@heroui/react";
import { TrendingUp } from "lucide-react";
import { useCurrentAssignmentData } from "@/contexts/assignment-data-context";
import { useRegisteredCourseData } from "@/contexts/registered-course-context";
import { useCurrentAssignmentStatus } from "@/contexts/assignment-status-context";
import { useSessionUserData } from "@/contexts/user-data-context";

export function AssignmentProgress() {
    const email = useSessionUserData().email;
    const registeredCourse = useRegisteredCourseData().courseDataList;
    const assignmentStatus = useCurrentAssignmentStatus();
    const {assignmentData} = useCurrentAssignmentData();

    // すべての課題を取得
    const assignments = assignmentData?.filter(
        assignment => registeredCourse.find(
            ({course}) => course.name === assignment.courseName
        )
    );

    // 提出済みの課題を取得
    const submittedAssignments = assignments?.filter(
        assignment => assignmentStatus.filter(
            assignmentStatus => 
                assignmentStatus.assignmentId === assignment.id &&
                assignmentStatus.status === "提出済" &&
                assignmentStatus.email === email
        ).length > 0
    );

    return (
        <div className="bg-gradient-to-b from-warning-50 to-warning-100 shadow-small rounded-large p-2 space-y-2">
            <div className="flex items-center gap-2">
                <TrendingUp 
                    width={24} 
                    height={24} 
                />
                <h1 className="text-xl font-medium m-2">
                    課題進行状況
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <Progress 
                    aria-label="assignment-progress"
                    value={submittedAssignments?.length ?? 0 / (assignments?.length ?? 0) * 100} 
                />
                <p>
                    {submittedAssignments?.length ?? 0}/{assignments?.length ?? 0}
                </p>
            </div>
            <div className="flex items-center justify-between gap-2">
                <p>提出済みの課題: {submittedAssignments?.length ?? 0}</p>
                <p>すべての課題: {assignments?.length ?? 0}</p>
            </div>
        </div>
    );
}