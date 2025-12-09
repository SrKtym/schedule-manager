'use client';

import { Button } from '@heroui/react';
import * as m from 'motion/react-m';
import { Card, CardBody } from '@heroui/react';
import { FileText } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAssignmentData } from '@/contexts/assignment-data-context';
import { dateOptionforAnnouncement } from '@/constants/definitions';


export function OtherAssignment({id}: {id: string}) {
    const assignmentData = useAssignmentData();
    const OtherAssignmentList = assignmentData?.filter(
        assignment => assignment.id !== id
    );
    const router = useRouter();
    const pathName = usePathname();
    const segments = pathName.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    return (
        // この講義の他の課題
        <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <Card className="border border-divider">
                <CardBody className="p-4">
                    <h3 className="text-medium font-medium mb-3">
                        この講義の他の課題
                    </h3>
                    
                    <div className="space-y-3">
                        {OtherAssignmentList?.map((assignment) => (
                            <Button
                                key={assignment.id}
                                variant="light"
                                className="w-full justify-start text-left h-auto py-2"
                                startContent={
                                    <div className="w-8 h-8 rounded-full bg-content2 flex items-center justify-center flex-shrink-0">
                                        <FileText width={16} />
                                    </div>
                                }
                                onPress={() => router.replace(`${pathName}/${assignment.id}`)}
                            >
                                <div className="truncate">
                                    <p className="font-medium truncate">
                                        {assignment.title}
                                    </p>
                                    <p className="text-xs text-default-500">
                                        {assignment.dueDate.toLocaleDateString("default", dateOptionforAnnouncement)}
                                    </p>
                                </div>
                            </Button>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </m.div>
    )
}