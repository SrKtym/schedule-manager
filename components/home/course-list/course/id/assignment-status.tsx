'use client';

import * as m from 'motion/react-m';
import { LazyMotion, domAnimation } from 'motion/react';
import { Card, CardBody, Progress } from '@heroui/react';
import { Chip } from '@heroui/react';
import { dateOptionforAnnouncement } from '@/constants/definitions';
import { getAssignmentStatusColor } from '@/utils/related-to-assignment';
import { useCurrentAssignmentData } from '@/contexts/assignment-data-context';
import { useCurrentAssignmentStatus } from '@/contexts/assignment-status-context';


export function AssignmentStatus({id}: {id: string}) {
    const {currentAssignment} = useCurrentAssignmentData(id);
    const assignmentStatus = useCurrentAssignmentStatus();
    const currentAssignmentStatus = assignmentStatus.find(
        ({assignmentId}) => assignmentId === id
    );
    const isTeacher = false;
    
    return (
        <div className="space-y-6">
            {/* 課題の提出状況 */}
            <LazyMotion features={domAnimation}>
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border border-divider">
                        <CardBody className="p-4">
                            <h3 className="text-medium font-medium mb-3">
                                提出状況
                            </h3>
                            
                            <div className="space-y-4">
                                {currentAssignment && (
                                    <div>

                                        {/* 提出期限 */}
                                        <p className="text-sm text-default-500 mb-1">
                                            提出期限
                                        </p>
                                        <p className="text-sm font-medium">
                                            {currentAssignment.dueDate.toLocaleDateString("default", dateOptionforAnnouncement)}
                                        </p>

                                        {/* メンバーの提出状況（学生用） */}
                                        {!isTeacher && currentAssignmentStatus && (
                                            <div>
                                                <p className="text-sm text-default-500 mb-1">
                                                    あなたの提出状況
                                                </p>
                                                <Chip 
                                                    size="sm" 
                                                    variant="flat" 
                                                    color={getAssignmentStatusColor(currentAssignmentStatus.status)}
                                                >
                                                    {currentAssignmentStatus.status}
                                                </Chip>
                                            </div>
                                        )}

                                        {/* メンバーの提出状況（教員用） */}
                                        {isTeacher && (
                                            <div>
                                                <p className="text-sm text-default-500 mb-1">
                                                    メンバーの提出状況
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={50} 
                                                        size="sm" 
                                                        color="primary" 
                                                        aria-label="Submission progress" 
                                                        className="flex-1" 
                                                    />
                                                    <span className="text-sm">1/2</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* 点数 */}
                                        <div>
                                            <p className="text-sm text-default-500 mb-1">   
                                                点数
                                            </p>
                                            <p className="text-sm font-medium">
                                                {currentAssignment.points} 点
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </m.div>
            </LazyMotion>
        </div>
    );
}