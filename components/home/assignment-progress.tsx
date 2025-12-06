'use client';

import { Progress } from "@heroui/react";
import { TrendingUp } from "lucide-react";
import { useAssignmentData } from "@/contexts/assignment-data-context";

export function AssignmentProgress() {
    // すべての課題を取得
    const assignmentData = useAssignmentData();

    // 提出済みの課題を取得
    const submittedAssignments = assignmentData?.filter(
        ({assignmentStatus}) => {assignmentStatus?.status === "提出済"}
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
                    value={(submittedAssignments?.length ?? 0) / (assignmentData?.length ?? 0) * 100} 
                />
                <p>
                    {submittedAssignments?.length ?? 0} / {assignmentData?.length ?? 0}
                </p>
            </div>
            <div className="flex items-center justify-between gap-2">
                <p>
                    提出済みの課題: {submittedAssignments?.length ?? 0}
                </p>
                <p>
                    すべての課題: {assignmentData?.length ?? 0}
                </p>
            </div>
        </div>
    );
}