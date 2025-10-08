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
import { AttachmentData } from '@/types/regisered-course';
import { allowedMimeTypes } from '@/constants/definitions';
import { createAnnouncement } from '@/utils/action';

export function CreateAnnouncementForm({ courseName }: { courseName: string }) {
    const [content, setContent] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentData[]>([]);
    const [state, formAction, isPending] = useActionState(createAnnouncement, undefined)
    const userData = useSessionUserData();

    const handleFileUpload = (file: AttachmentData) => {
        setAttachments(prev => [...prev, file]);
      };
    
    const handleFileRemove = (fileId: string) => {
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
                                    isRequired
                                />
                                <Textarea
                                    name="content"
                                    placeholder="アナウンスメントを投稿"
                                    value={content}
                                    onValueChange={setContent}
                                    variant='bordered'
                                    minRows={3}
                                    isRequired
                                />
                                <Select
                                    label="タイプ"
                                    name="type"
                                    variant='bordered'
                                    isRequired
                                >
                                    <SelectItem>
                                        資料
                                    </SelectItem>
                                    <SelectItem>
                                        アンケート
                                    </SelectItem>
                                    <SelectItem>
                                        その他
                                    </SelectItem>
                                </Select>
                                <FileUploader 
                                    onFileUpload={handleFileUpload}
                                    onFileRemove={handleFileRemove}
                                    files={attachments}
                                    maxFiles={10}
                                    allowedTypes={allowedMimeTypes}
                                    id={"1"}
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
                                        isDisabled={!content.trim()}
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

