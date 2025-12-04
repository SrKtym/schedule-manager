'use client';

import { 
    Button, 
    Select, 
    SelectItem
} from "@heroui/react";
import { FileText, Settings } from "lucide-react";
import { useAssignmentData } from "@/contexts/assignment-data-context";
import { useRegisteredCourseDataList } from "@/contexts/registered-course-context";

export function UpcomingAssignment() {
    const {courseDataList} = useRegisteredCourseDataList();
    const assignmentData = useAssignmentData();
    const assignments = assignmentData?.filter(
        assignment => courseDataList.find(
            ({course}) => course.name === assignment.courseName
        ) && assignment.dueDate.getDate() - new Date().getDate() <= 7
    );

    return (
        <div className="relative max-h-[400px] bg-gradient-to-b from-danger-50 to-danger-100 shadow-small rounded-large p-2">
            <div className="flex items-center gap-2">
                <FileText 
                    width={24} 
                    height={24} 
                />
                <h1 className="text-xl font-medium m-2">
                    直近の課題
                </h1>
            </div>
            <div className="flex items-center gap-3 absolute right-2 top-2">
                <Select
                    className="w-[110px]"
                    name="dueDate"
                    label="期限日"
                    labelPlacement="inside"
                    size="sm"
                    radius="lg"
                    variant="bordered"
                >
                    <SelectItem key="3日以内">
                        3日以内
                    </SelectItem>
                    <SelectItem key="7日以内">
                        7日以内
                    </SelectItem>
                </Select>
                <Button
                    aria-label="settings"
                    isIconOnly
                    variant="light"
                >
                    <Settings 
                        width={24} 
                        height={24} 
                    />
                </Button>
            </div>
            {assignments ? (
                <p className="text-center p-5">
                    {assignments.map(assignment => (
                        <span key={assignment.id} className="block mb-2">
                            {assignment.name}
                        </span>
                        )
                    )}
                </p>
            ) : (
                <p className="text-center p-5">
                    直近の課題はありません
                </p>
            )}
        </div>
    );
}