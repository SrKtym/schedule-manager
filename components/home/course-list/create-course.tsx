'use client';

import { 
    Button,
    Input,
    Modal, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalBody, 
    Select,
    SelectItem
} from "@heroui/react";
import { useSessionUserData } from "@/contexts/user-data-context";
import { 
    credit, 
    targetFaculty, 
    targetGrade, 
    week 
} from "@/constants/definitions";
import { useActionState, useState } from "react";
import { targetDepartment } from "@/utils/related-to-register";
import { Plus } from "lucide-react";
import { createCourse } from "@/utils/action";

export function CreateCourse() {
    const userData = useSessionUserData();
    const [open, setOpen] = useState<boolean>(false);
    const [currentfaculty, setCurrentFaculty] = useState<string>();
    const [state, formAction, isPending] = useActionState(createCourse, undefined)

    return (
        <>
            <Button
                color="primary"
                startContent={<Plus width={18} />}
                onPress={() => setOpen(true)}
            >
                講義作成
            </Button>
            <Modal 
                isOpen={open} 
                onOpenChange={setOpen}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        講義の新規作成
                    </ModalHeader>
                    <ModalBody>
                        <form action={formAction}>
                            <Input
                                name="course"
                                label="講義名"
                                type="text"
                                isRequired
                            />
                            <Select
                                name="grade"
                                label='対象学年' 
                                placeholder="学年を選んでください"
                                variant="bordered"
                                isRequired
                            >
                            {targetGrade.map((grade) => (
                                <SelectItem key={grade}>
                                    {grade}
                                </SelectItem>
                            ))}
                            </Select>
                            <Select
                                name="faculty"
                                label='対象学部' 
                                placeholder="学部を選んでください"
                                variant="bordered"
                                isRequired
                                onChange={(e) => {
                                    setCurrentFaculty(e.target.value);
                                }}
                            >
                                {targetFaculty.map((faculty) => (
                                    <SelectItem key={faculty}>
                                        {faculty}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                name="department"
                                label='対象学科' 
                                placeholder="学科を選んでください"
                                variant="bordered"
                                errorMessage='学部が選択されていません。'
                                isRequired
                                isInvalid={!currentfaculty}
                                disabledKeys={currentfaculty ? undefined : targetDepartment()}
                            >
                                {targetDepartment(currentfaculty).map((department) => (
                                    <SelectItem key={department}>
                                        {department}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                name="week"
                                label='週'
                                placeholder="週を選んでください"
                                variant="bordered"
                                isRequired
                            >
                                {week.map((week) => (
                                    <SelectItem key={week}>
                                        {week}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                name="period"
                                label='時限'
                                placeholder="時限を選んでください"
                                variant="bordered"
                                isRequired
                            >
                                {credit.map((credit) => (
                                    <SelectItem key={credit}>
                                        {credit}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Input
                                type="text"
                                label="教室"
                                placeholder="「L半角数字」の形式で入力してください（例：L101）。数字は101～999の範囲で入力してください。"
                                isRequired
                            />
                            <input
                                name="professor"
                                type="hidden"
                                value={userData?.name}
                            />
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            color="primary" 
                            isDisabled={isPending}
                            isLoading={isPending}
                        >
                            作成
                        </Button>
                        <Button 
                            variant="flat" 
                            onPress={() => setOpen(false)}
                        >
                            キャンセル
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}