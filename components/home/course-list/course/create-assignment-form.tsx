'use client';

import { allowedMimeTypes, attachmentIsRelatedTo, attachmentType } from '@/constants/definitions';
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    Button, 
    Input, 
    Textarea, 
    Select,
    SelectItem,
    DatePicker
} from '@heroui/react';
import { useActionState, useState } from 'react';
import { createAssignment, removeFile } from '@/utils/actions/main';
import { Plus } from 'lucide-react';
import { FileUploader } from './file-uploader';
import { AttachmentData } from '@/types/main/regisered-course';

export function CreateAssignmentForm({ courseName }: { courseName: string}) {
    const [open, setOpen] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentData[]>([]);
    const [state, formAction, isPending] = useActionState(createAssignment, undefined);

    const handleFileRemove = async (
        fileId: string, 
        relatedTo: typeof attachmentIsRelatedTo[number]
    ) => {
        await removeFile(fileId, relatedTo);
        setAttachments(prev => prev.filter(file => file.id !== fileId));
      };

    return (
        <>
            <Button 
                color="primary"
                startContent={<Plus width={18} />}
                onPress={() => setOpen(true)}
            >
                課題作成
            </Button>
            <Modal 
                isOpen={open} 
                onOpenChange={setOpen}
                size="lg"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        作成
                    </ModalHeader>
                    <ModalBody>
                        <form
                            action={formAction}
                            className='space-y-4'
                        >
                            <Input
                                label="課題名"
                                name="name"
                                placeholder="課題名を入力してください。"
                                variant="bordered"
                                aria-describedby="name-error"
                                isRequired
                            />
                            <div id='name-error' aria-live='polite' aria-atomic='true'>
                                {state?.errors?.name && state.errors.name.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>{error}</p>
                                ))}
                            </div>
                            <Textarea
                                label="説明文"
                                name="description"
                                placeholder="説明文を入力してください。"
                                variant="bordered"
                                aria-describedby="description-error"
                                minRows={3}
                                isRequired
                            />
                            <div id='description-error' aria-live='polite' aria-atomic='true'>
                                {state?.errors?.description && state.errors.description.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>{error}</p>
                                ))}
                            </div>
                            <Input
                                type="number"
                                label="点数"
                                name="points"
                                placeholder="点数を入力してください。"
                                variant="bordered"
                                defaultValue="100"
                                aria-describedby="points-error"
                                min={0}
                                max={100}
                            />
                            <div id='points-error' aria-live='polite' aria-atomic='true'>
                                {state?.errors?.points && state.errors.points.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>{error}</p>
                                ))}
                            </div>
                            <DatePicker
                                label="期限日"
                                name="dueDate"
                                variant="bordered"
                                aria-describedby="dueDate-error"
                            />
                            <div id='dueDate-error' aria-live='polite' aria-atomic='true'>
                                {state?.errors?.dueDate && state.errors.dueDate.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>{error}</p>
                                ))}
                            </div>
                            <Select
                                label="ファイルタイプの指定"
                                name="fileType"
                                variant='bordered'
                            >
                                {attachmentType.map((type) => (
                                    <SelectItem key={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </Select>
                            <input
                                type="hidden"
                                name="courseName"
                                value={courseName}
                            />
                            <FileUploader
                                files={attachments}
                                maxFiles={10}
                                allowedTypes={allowedMimeTypes}
                                relatedTo="assignment"
                                onFileRemove={handleFileRemove}
                            />
                            <div className='flex items-center justify-end gap-3'>
                                <Button 
                                    color="primary"  
                                    type="submit"
                                    aria-disabled={isPending}
                                    isLoading={isPending}    
                                >
                                    作成
                                </Button>
                                <Button 
                                    variant="flat" 
                                    onPress={() => setOpen(prev => !prev)}
                                >
                                    キャンセル
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

