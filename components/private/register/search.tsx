'use client';

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { targetGrade, targetFaculty, targetDepartment } from "@/lib/definitions";

export function SearchField() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    const [invalid, setInvalid] = useState<boolean>(false);

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const param = new URLSearchParams(searchParams);
        if (e.target.value) {
            param.set(e.target.name, e.target.value);
        } else {
            param.delete(e.target.name);
        }
        router.replace(`${pathName}?${param}`);
    };

    const handleSearch = useDebouncedCallback((term: string) => {
        const param = new URLSearchParams(searchParams);
        param.set('page', '1');
        if (term) {
            param.set('query', term);
        } else {
            param.delete('query');
        }
        router.replace(`${pathName}?${param}`);
    }, 300);

    return (
        <div className="space-y-5">
            <div className="flex space-x-5">
                <Select
                    name="grade"
                    label='対象学年' 
                    placeholder="学年を選んでください"
                    defaultSelectedKeys={searchParams.get('grade')?.split(',')}
                    selectionMode="multiple"
                    variant="bordered"
                    onChange={handleFilter}
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
                    defaultSelectedKeys={searchParams.get('faculty')?.split(',')}
                    selectionMode="multiple"
                    variant="bordered"
                    onChange={handleFilter}
                >
                    {targetFaculty.map((faculity) => (
                        <SelectItem key={faculity}>
                            {faculity}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    name="department"
                    label='対象学科' 
                    placeholder="学科を選んでください"
                    defaultSelectedKeys={searchParams.get('department')?.split(',')}
                    selectionMode="multiple"
                    variant="bordered"
                    errorMessage='学部が選択されていません'
                    disabledKeys={searchParams.get('faculty') ? undefined : targetDepartment}
                    isInvalid={invalid}
                    onChange={handleFilter}
                    onOpenChange={() => searchParams.get('faculty') ? setInvalid(false) : setInvalid(true)}
                >
                    {targetDepartment.map((department) => (
                        <SelectItem key={department}>
                            {department}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div className="relative flex space-x-2">
                <Input 
                    className='pr-3' 
                    placeholder="講義名を入力してください。"
                    variant="bordered"
                    startContent={<Search className="h-[18px] w-[18px]" color="gray"/>}
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}/>
                <Button className='sr-only' color="primary">検索</Button>
            </div>
        </div>
    );
}