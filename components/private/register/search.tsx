'use client';

import { 
    Input,
    Select, 
    SelectItem, 
    SelectSection
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { 
    targetGrade, 
    targetFaculty, 
    targetDepartment, 
    week, 
    period, 
    credit, 
    required, 
    rows 
} from "@/lib/definitions";

export function SearchField(
    {
        itemsLength,
        rowsPerPage
    }: {
        itemsLength: number,
        rowsPerPage: number
    }
) {
    const searchParams = useSearchParams();
    const param = new URLSearchParams(searchParams);
    const pathName = usePathname();
    const router = useRouter();
    const [invalid, setInvalid] = useState<boolean>(false);

    const getParam = (name: 'grade' | 'faculty' | 'department' | 'required') => {
        const values = param.get(name)?.split(",");
        return values;
    }

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            param.set(e.target.name, e.target.value);
        } else {
            param.delete(e.target.name);
            if (!param.get('faculty')) param.delete('department');
        }
        router.replace(`${pathName}?${param}`);
    };

    const handleSearch = useDebouncedCallback((term: string) => {
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
            <div className="grid grid-cols-3 gap-3">
                <Select
                    name="grade"
                    label='対象学年' 
                    placeholder="学年を選んでください"
                    defaultSelectedKeys={getParam('grade')}
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
                    defaultSelectedKeys={getParam('faculty')}
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
                    selectionMode="multiple"
                    variant="bordered"
                    errorMessage='学部が選択されていません。'
                    defaultSelectedKeys={getParam('department')}
                    disabledKeys={param.get('faculty') ? undefined : targetDepartment()}
                    isInvalid={invalid}
                    onChange={handleFilter}
                    onOpenChange={() => param.get('faculty') ? setInvalid(false) : setInvalid(true)}
                >
                    {getParam('faculty')?.map((faculty) => (
                        <SelectSection
                            key={faculty}
                            title={faculty}
                            showDivider
                            classNames={{
                                heading: "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small",
                        }}>
                            {targetDepartment(faculty).map((department) => (
                                <SelectItem key={department}>
                                    {department}
                                </SelectItem>
                            ))}
                        </SelectSection>
                    )) ?? null}
                </Select>
                <Select
                    name="week"
                    label="週"
                    placeholder="曜日を選んでください"  
                    selectionMode="multiple"
                    variant="bordered"
                    onChange={handleFilter}  
                >
                    {week.map((week) => (
                        <SelectItem key={week}>
                            {week}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    name="period"
                    label="時限"
                    placeholder="時限を選んでください"
                    selectionMode="multiple"
                    variant="bordered"
                    onChange={handleFilter}
                >
                    {period.map((period) => (
                        <SelectItem key={period}>
                            {period}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    name="credit"
                    label="単位"
                    placeholder="単位数を選んでください"
                    selectionMode="multiple"
                    variant="bordered"
                    onChange={handleFilter}
                >
                    {credit.map((credit) => (
                        <SelectItem key={credit}>
                            {credit}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <div className="flex space-x-2">
                <Input 
                    className='pr-3'
                    type="text"
                    placeholder="講義名を入力してください。"
                    variant="bordered"
                    startContent={
                        <Icon 
                            icon="lucide:search"
                            width={18}
                            height={18} 
                            className="text-default-400" 
                        />
                    }
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={param.get('query')?.toString()}
                />
            </div>
            <div className="flex justify-between items-center">
                <span>
                    検索結果: 
                    <Suspense fallback={<p>処理中...</p>}>
                        {itemsLength}件のアイテム
                    </Suspense>
                </span>
                <div className="w-full max-w-[280px] grid grid-cols-2 gap-x-3">
                    <Select
                        name="required"
                        label="履修要件"
                        labelPlacement="inside"
                        selectionMode="multiple"
                        defaultSelectedKeys={getParam('required')}
                        variant="bordered"
                        onChange={handleFilter}
                    >
                        {required.map((required) => (
                            <SelectItem key={required}>
                                {required}
                            </SelectItem>
                        ))}
                    </Select>
                    <Select
                        name="rows"
                        label="表示件数"
                        labelPlacement="inside"
                        defaultSelectedKeys={[rowsPerPage.toString()]}
                        variant="bordered"
                        onChange={handleFilter}
                    >
                        {rows.map((row) => (
                            <SelectItem key={row}>
                                {row.toString()}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
}