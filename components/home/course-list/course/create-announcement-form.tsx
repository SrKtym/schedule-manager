'use client';

import { useSessionUserData } from '@/contexts/user-data-context';
import { 
    Card, 
    CardBody, 
    Avatar, 
    Button, 
    Textarea, 
    Select,
    SelectItem,
    Input
} from '@heroui/react';
import { useActionState, useState } from 'react';
import { FileUploader } from './file-uploader';
import { AttachmentData } from '@/types/main/regisered-course';
import { allowedMimeTypes, announcementType, attachmentIsRelatedTo } from '@/constants/definitions';
import { createAnnouncement } from '@/utils/actions/main';
import { removeFile } from '@/utils/actions/main';


export function CreateAnnouncementForm({ courseName }: { courseName: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentData[]>([]);
    const [state, formAction, isPending] = useActionState(createAnnouncement, undefined)
    const userData = useSessionUserData();

    // const handleFileUpload = (file: AttachmentData) => {
    //     setAttachments(prev => [...prev, file]);
    //   };
    
    const handleFileRemove = async (
        fileId: string, 
        relatedTo: typeof attachmentIsRelatedTo[number]
    ) => {
        await removeFile(fileId, relatedTo);
        setAttachments(prev => prev.filter(file => file.id !== fileId));
      };

    return (
        <Card className="border border-divider">
            <CardBody className="p-4">
                <div className="flex gap-3">
                    <Avatar
                        src={userData?.image ?? undefined}
                        name={userData?.name}
                        size="md"
                    />
                    <div className="flex-1">
                        {isExpanded ? (
                            <form 
                                action={formAction}
                                className='space-y-4'
                            >
                                <Input
                                    label="タイトル"
                                    name="title"
                                    variant='bordered'
                                    aria-describedby='title-error'
                                    isRequired
                                />
                                <div id='title-error' aria-live='polite' aria-atomic='true'>
                                    {state?.errors?.title && state.errors.title.map((error: string) => (
                                        <p className='text-base text-red-500' key={error}>{error}</p>
                                    ))}
                                </div>
                                <Textarea
                                    name="content"
                                    placeholder="アナウンスメントを投稿"
                                    variant='bordered'
                                    minRows={3}
                                    aria-describedby='content-error'
                                    isRequired
                                />
                                <div id='content-error' aria-live='polite' aria-atomic='true'>
                                    {state?.errors?.content && state.errors.content.map((error: string) => (
                                        <p className='text-base text-red-500' key={error}>{error}</p>
                                    ))}
                                </div>
                                <Select
                                    label="タイプ"
                                    name="type"
                                    variant='bordered'
                                    aria-describedby='type-error'
                                    isRequired
                                >
                                    {announcementType.map((type) => (
                                        <SelectItem key={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <div id='type-error' aria-live='polite' aria-atomic='true'>
                                    {state?.errors?.type && state.errors.type.map((error: string) => (
                                        <p className='text-base text-red-500' key={error}>{error}</p>
                                    ))}
                                </div>
                                <FileUploader 
                                    files={attachments}
                                    maxFiles={10}
                                    allowedTypes={allowedMimeTypes}
                                    relatedTo="announcement"
                                    onFileRemove={handleFileRemove}
                                />
                                <input
                                    type="hidden"
                                    name="courseName"
                                    value={courseName}
                                />
                                <div className="flex justify-end gap-3">
                                    <Button 
                                        color="primary"
                                        type="submit"
                                        aria-disabled={isPending}
                                        isLoading={isPending}
                                    >
                                        投稿
                                    </Button>
                                    <Button 
                                        variant="light" 
                                        onPress={() => setIsExpanded(false)}
                                    >
                                        キャンセル
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <Button 
                                className="w-full justify-start h-10 px-4 text-default-500"
                                variant="flat"
                                onPress={() => setIsExpanded(true)}
                            >
                                アナウンスメントを投稿
                            </Button>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

