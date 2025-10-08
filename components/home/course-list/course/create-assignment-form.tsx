'use client';

import { attachmentType } from '@/constants/definitions';
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    Input, 
    Textarea, 
    Select,
    SelectItem,
    DatePicker
} from '@heroui/react';
import { useActionState, useState } from 'react';
import { createAssignment } from '@/utils/action';

export function CreateAssignmentForm({ 
    isOpen, 
    onClose
}: { 
    isOpen: boolean;
    onClose: () => void;
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('100');
    const [state, formAction, isPending] = useActionState(createAssignment, undefined)
    

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            size="lg"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            作成
                        </ModalHeader>
                        <ModalBody>
                            <form
                                action={formAction}
                                className='space-y-4'
                            >
                                <Input
                                    label="タイトル"
                                    placeholder="タイトルを入力してください。"
                                    variant='bordered'
                                    value={title}
                                    onValueChange={setTitle}
                                    isRequired
                                />
                                <Textarea
                                    label="説明文"
                                    placeholder="説明文を入力してください。"
                                    variant='bordered'
                                    value={description}
                                    onValueChange={setDescription}
                                    minRows={3}
                                    isRequired
                                />
                                <Input
                                    type="number"
                                    label="点数"
                                    placeholder="点数を入力してください。"
                                    variant='bordered'
                                    value={points}
                                    onValueChange={setPoints}
                                    min={0}
                                    max={100}
                                />
                                <DatePicker
                                    label="期限日"
                                    variant='bordered'
                                />
                                <Select
                                    label="ファイルタイプの指定"
                                    variant='bordered'
                                >
                                    {attachmentType.map((type) => (
                                        <SelectItem key={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                color="primary"  
                                type="submit"
                                isDisabled={!title || !description}
                                isLoading={isPending}
                                
                            >
                                作成
                            </Button>
                            <Button 
                                variant="flat" 
                                onPress={onClose}
                            >
                                キャンセル
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

