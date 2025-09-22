'use client';

import { 
    Card, 
    CardBody,
    Avatar,
    Chip,
    Button,
    Input
} from '@heroui/react';
import * as m from 'motion/react-m';
import { LazyMotion, domAnimation } from 'motion/react';
import { useCurrentAssignmentStatus } from '@/contexts/assignment-status-context';
import { useCurrentSubmissionMetaData } from '@/contexts/submission-context';
import { dateOptionforAnnouncement } from '@/constants/definitions';


export function Evaluated() {
    const assignmentStatus = useCurrentAssignmentStatus();
    const { submission } = useCurrentSubmissionMetaData() ?? {};
    const isTeacher = false;
    
    return (
        // 評定
        isTeacher && assignmentStatus && (
            <LazyMotion features={domAnimation}>
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card className="border border-divider">
                        <CardBody className="p-6">
                            <h2 className="text-lg font-google-sans font-medium mb-4">
                                提出状況
                            </h2>
                            <div className="space-y-4">
                                {assignmentStatus.map((assignmentStatus, index) => (
                                    <>
                                        {/* 提出済み */}
                                        {
                                            assignmentStatus.status === '提出済' && 
                                            submission && (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-content2 rounded-medium"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            src="https://img.heroui.chat/image/avatar?w=200&h=200&u=4"
                                                            name="Sarah Williams"
                                                        size="sm"
                                                    />
                                                        <div>
                                                            <p className="font-medium">
                                                                {assignmentStatus.userName}
                                                            </p>
                                                            <p className="text-xs text-default-500">
                                                                提出日時: {submission?.updatedAt.toLocaleDateString("default", dateOptionforAnnouncement)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            aria-label="Points"
                                                            placeholder={`/${assignmentStatus.evaluated}`}
                                                        size="sm"
                                                        className="w-20"
                                                    />
                                                        <Button 
                                                            size="sm" 
                                                            color="primary" 
                                                            variant="flat"
                                                        >
                                                            評定
                                                        </Button>
                                                    </div>
                                                </div>
                                        )}

                                        {/* 未提出 */}
                                        {assignmentStatus.status === '未提出' && (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-content2 rounded-medium"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src="https://img.heroui.chat/image/avatar?w=200&h=200&u=5"
                                                        name="James Brown"
                                                        size="sm"
                                                    />
                                                    <div>
                                                        <p className="font-medium">
                                                            {assignmentStatus.userName}
                                                        </p>
                                                        <p className="text-xs text-default-500">
                                                            まだ提出していません
                                                        </p>
                                                    </div>
                                                </div>
                                                <Chip 
                                                    variant="flat" 
                                                    color="default" 
                                                    size="sm"
                                                >
                                                    未提出
                                                </Chip>
                                            </div>
                                        )}
                                    </>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </m.div>
            </LazyMotion>
        )
    )
}

