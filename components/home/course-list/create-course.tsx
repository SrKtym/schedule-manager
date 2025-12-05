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
    department,
    faculty, 
    grade, 
    week 
} from "@/constants/definitions";
import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { createCourse } from "@/utils/actions/main";
import { objectValues } from "@/utils/helpers/register";

export function CreateCourse() {
    const userData = useSessionUserData();
    const [open, setOpen] = useState<boolean>(false);
    const [currentfaculty, setCurrentFaculty] = useState<typeof faculty[number]>();
    const [state, formAction, isPending] = useActionState(createCourse, undefined);

    const departmentValues = () => {
        if (currentfaculty) {
            const departmentValues = objectValues(department, currentfaculty);
            return departmentValues;
        } else {
            return [];
        }
    }

    const departmentList = departmentValues();
    const disabledKeys = objectValues(department, "全学部")
        .filter(department => !(department in departmentList));

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
                                aria-describedby="course-error"
                            />
                            <div id="course-error" aria-live="polite" aria-atomic="true">
                                {state?.errors?.name && state.errors.name.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>{error}</p>
                                ))}
                            </div>
                            <Select
                                name="grade"
                                label='対象学年' 
                                placeholder="学年を選んでください"
                                variant="bordered"
                                isRequired
                            >
                            {grade.map((grade) => (
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
                                onChange={e => setCurrentFaculty(e.target.value as typeof faculty[number])}
                            >
                                {faculty.map((faculty) => (
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
                                disabledKeys={disabledKeys}
                            >
                                {departmentList.map((department) => (
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
                                name="classroom"
                                type="text"
                                label="教室"
                                placeholder="「L半角数字」の形式で入力してください（例：L101）。数字は101～999の範囲で入力してください。"
                                isRequired
                                aria-describedby="classroom-error"
                            />
                            <div id="classroom-error" aria-live="polite" aria-atomic="true">
                                {state?.errors?.classroom && state.errors.classroom.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>{error}</p>
                                ))}
                            </div>
                            <input
                                name="professor"
                                type="hidden"
                                value={userData?.name}
                                aria-describedby="professor-error"
                            />
                            <div id="professor-error" aria-live="polite" aria-atomic="true">
                                {state?.errors?.professor && state.errors.professor.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>{error}</p>
                                ))}
                            </div>
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