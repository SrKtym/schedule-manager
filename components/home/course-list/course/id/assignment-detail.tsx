'use client';

import { LazyMotion, domAnimation } from 'motion/react';
import * as m from 'motion/react-m';
import { 
    Button, 
    Card, 
    CardBody, 
    Chip, 
    Divider 
} from '@heroui/react';
import { 
    ArrowLeft, 
    Calendar, 
    Download, 
    FileText, 
    MoreVertical, 
    Paperclip 
} from 'lucide-react';
import { getFileColor } from '@/utils/related-to-assignment';
import { attachmentMetaData } from '@/lib/drizzle/schema/public';
import { dateOptionforAnnouncement } from '@/constants/definitions';
import { useCurrentAssignmentData } from '@/contexts/assignment-data-context';

export function AssignmentDetail({id}: {id: string}) {
    const isTeacher = false;
    const {currentAssignment, currentAttachmentMetaData} = useCurrentAssignmentData(id);

    return (
        currentAssignment && attachmentMetaData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                    <LazyMotion features={domAnimation}>
                        <m.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border border-divider">
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="mt-1">
                                                <div className="w-12 h-12 rounded-full bg-content2 flex items-center justify-center">
                                                    {currentAssignment.type && (
                                                        <FileText 
                                                            className={`text-${getFileColor(currentAssignment.type)}`}
                                                            width={24} 
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className='space-y-2'>
                                                <h1 className="text-2xl font-google-sans font-medium">
                                                    {currentAssignment.name}
                                                </h1>
                                                <span>
                                                    {currentAssignment.createdAt.toLocaleDateString("default", dateOptionforAnnouncement)}
                                                </span>
                                                {currentAssignment.points && (
                                                    <div className="mt-2">
                                                        <Chip 
                                                            size="sm" 
                                                            variant="flat" 
                                                            color="primary"
                                                        >
                                                            {currentAssignment.points} 点
                                                        </Chip>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </m.div>
                    </LazyMotion>
        
                    {isTeacher && (
                        <Button
                            variant="light"
                            isIconOnly
                            aria-label="Edit"
                        >
                            <MoreVertical width={20} />
                        </Button>
                    )}
                </div>
    
                <Divider className="my-6" />
    
                {currentAssignment.dueDate && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar 
                                width={16} 
                                className="text-default-500" 
                            />
                            <span className="font-medium">
                                期限日
                            </span>
                        </div>
                        <p className="text-default-600 ml-6">
                            {currentAssignment.dueDate.toLocaleDateString()}
                        </p>
                    </div>
                )}
    
                {currentAssignment.description && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <ArrowLeft 
                                width={16} 
                                className="text-default-500" 
                            />
                            <span className="font-medium">
                                説明
                            </span>
                        </div>
                        <div className="prose prose-sm max-w-none text-default-600 ml-6">
                            <p className="whitespace-pre-line">
                                {currentAssignment.description}
                            </p>
                        </div>
                    </div>
                )}
        
                {currentAssignment.attachmentsMetaDataIds && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Paperclip 
                            width={16} 
                            className="text-default-500" 
                        />
                            <span className="font-medium">
                                添付ファイル
                            </span>
                        </div>
                        <div className="space-y-2 ml-6">
                            {currentAttachmentMetaData?.map(metaData => (
                                <Card 
                                    key={metaData.id} 
                                    className="border border-divider"
                                >
                                    <CardBody className="p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-content2 flex items-center justify-center">
                                            <FileText
                                                width={20}
                                                className={`text-${getFileColor(metaData.type)}`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {metaData.name}
                                            </p>
                                            <p className="text-xs text-default-500 capitalize">
                                                {metaData.type}
                                            </p>
                                        </div>
                                        <Button
                                            as="a"
                                            href={metaData.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            startContent={<Download width={14} />}
                                        >
                                            開く
                                        </Button>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
        </div>
        )
    );
}