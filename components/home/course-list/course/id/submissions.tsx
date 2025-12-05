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
import { useActionState, useState } from 'react';
import { AssignmentTabKey, AttachmentData } from '@/types/main/regisered-course';
import { allowedMimeTypes, attachmentIsRelatedTo } from '@/constants/definitions';
import { useCurrentAssignmentData } from '@/contexts/assignment-data-context';
import { removeFile, submitAssignment } from '@/utils/actions/main';

export function Submissions({id}: {id: string}) {
    const currentAssignment = useCurrentAssignmentData(id);
    const [attachments, setAttachments] = useState<AttachmentData[]>([]);
    const [selectedTab, setSelectedTab] = useState<AssignmentTabKey>('text');
    const [submitState, formAction, isPending] = useActionState(submitAssignment, undefined);
    const isTeacher = false;

    const handleFileRemove = async (
        fileId: string,
        relatedTo: typeof attachmentIsRelatedTo[number]
    ) => {
        await removeFile(fileId, relatedTo);
        setAttachments(prev => prev.filter(file => file.name !== fileId));
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
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium">
                                    課題の提出
                                </h2>
                                <Chip 
                                    variant="flat" 
                                    color={
                                        currentAssignment.assignmentStatus?.status === '評定済' ? 'success' : 
                                        currentAssignment.assignmentStatus?.status === '提出済' ? 'primary' : 
                                        'warning'
                                    }
                                >
                                    {currentAssignment.assignmentStatus?.status}
                                </Chip>
                            </div>
                 
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
                                    <form 
                                        action={formAction}
                                        className="space-y-4"
                                    >
                                        {selectedTab === 'text' && (
                                            <div className="flex flex-col space-y-4">
                                                <input 
                                                    type="hidden" 
                                                    name="assignmentId" 
                                                    value={currentAssignment.id} 
                                                />
                                                <Textarea
                                                    name="content"
                                                    isClearable
                                                    variant="bordered"
                                                    placeholder="テキストを入力してください。"
                                                    min={1}
                                                    max={2000}
                                                    aria-describedby="content-error"
                                                />
                                                <div id='content-error' aria-live='polite' aria-atomic='true'>
                                                    {submitState?.errors?.content && submitState.errors.content.map((error: string) => (
                                                        <p className='text-base text-red-500' key={error}>{error}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedTab === 'attachments' && (
                                            <FileUploader
                                                files={attachments}
                                                maxFiles={10}
                                                allowedTypes={allowedMimeTypes}
                                                relatedTo='submission'
                                                onFileRemove={handleFileRemove}
                                            />
                                        )}
                                        <Button
                                            type="submit"
                                            color="primary"
                                            aria-disabled={isPending}
                                            isLoading={isPending}
                                        >
                                            {currentAssignment.assignmentStatus?.status === '未提出' ? "提出する" : "編集して再提出する"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </m.div>
            </LazyMotion>
        )
    );   
}