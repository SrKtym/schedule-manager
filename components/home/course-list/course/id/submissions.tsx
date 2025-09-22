'use client';

import { 
    Button, 
    Card, 
    CardBody, 
    Chip, 
    Tab, 
    Tabs, 
    Textarea 
} from '@heroui/react';
import * as m from 'motion/react-m';
import { LazyMotion, domAnimation } from 'motion/react';
import { FileUploader } from '../file-uploader';
import { Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import { AssignmentTabKey, AttachmentData } from '@/types/regisered-course';
import { allowedMimeTypes } from '@/constants/definitions';
import { useCurrentAssignmentStatus } from '@/contexts/assignment-status-context';
import { useSessionUserData } from '@/contexts/user-data-context';
import { useCurrentAssignmentData } from '@/contexts/assignment-data-context';

export function Submissions({id}: {id: string}) {
    const {currentAssignment} = useCurrentAssignmentData(id);
    const email = useSessionUserData().email;
    const assignmentStatus = useCurrentAssignmentStatus().find(
        (assignmentStatus) => assignmentStatus.email === email
    );
    const [attachments, setAttachments] = useState<AttachmentData[]>([]);
    const [selectedTab, setSelectedTab] = useState<AssignmentTabKey>('text');
    const [text, setText] = useState('');
    const isTeacher = false;
    const handleFileUpload = (file: AttachmentData) => {
        setAttachments(prev => [...prev, file]);
      };

    const handleFileRemove = (fileId: string) => {
        setAttachments(prev => prev.filter(file => file.id !== fileId));
      };

    return (
        !isTeacher && currentAssignment && (
            <LazyMotion features={domAnimation}>
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card className="border border-divider">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-google-sans font-medium">
                                    提出状況
                                </h2>
                                <Chip 
                                    variant="flat" 
                                    color={
                                        assignmentStatus?.status === '評定済' ? 'success' : 
                                        assignmentStatus?.status === '提出済' ? 'primary' : 
                                        'warning'
                                    }
                                >
                                    {assignmentStatus?.status}
                                </Chip>
                            </div>
                
                            {assignmentStatus?.status === '未提出' ? 
                                <div className="mt-4">
                                    <div className="space-y-2">
                                        <Tabs
                                            aria-label="Assignment tabs"
                                            selectedKey={selectedTab}
                                            onSelectionChange={key => setSelectedTab(key as AssignmentTabKey)}
                                            variant="underlined"
                                            color="primary"
                                            classNames={{
                                                base: "overflow-x-auto",
                                                tabList: "w-full"
                                            }}
                                        >
                                            <Tab 
                                                key="text" 
                                                title="テキスト" 
                                            />
                                            <Tab 
                                                key="attachments" 
                                                title="添付ファイル" 
                                            />
                                        </Tabs>
                                        {selectedTab === 'text' && (
                                            <div className="flex flex-col space-y-4">
                                                <Textarea
                                                    isClearable
                                                    variant="bordered"
                                                    placeholder="テキストを入力してください。"
                                                    onValueChange={(value) => setText(value)}
                                                />
                                                <Button
                                                    color="primary"
                                                    isDisabled={!text}
                                                >
                                                    提出する
                                                </Button>
                                            </div>
                                        )}
                                        {selectedTab === 'attachments' && (
                                            <FileUploader
                                                onFileUpload={handleFileUpload}
                                                onFileRemove={handleFileRemove}
                                                files={attachments}
                                                maxFiles={10}
                                                allowedTypes={allowedMimeTypes}
                                                id={currentAssignment.id}
                                            />
                                        )}
                                    </div>
                                </div>
                                : 
                                <div className="space-y-3 mb-6">
                                    {attachments.map(file => (
                                        <Card key={file.id} className="border border-divider">
                                            <CardBody className="p-3 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-content2 flex items-center justify-center">
                                                    <FileText
                                                        width={20}
                                                        className='text-default-500'
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-default-500 capitalize">
                                                        {file.type}
                                                    </p>
                                                </div>
                                                <Button
                                                    as="a"
                                                    href={file.url as string}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                    startContent={<Eye width={14} />}
                                                >
                                                    見る
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            }
                        </CardBody>
                    </Card>
                </m.div>
            </LazyMotion>
        )
    );   
}