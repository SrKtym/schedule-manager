'use client';

import { Submissions } from './submissions';
import { Evaluated } from './evaluated';
import { CommentsOnAssignment } from './coments-on-assignment';
import { OtherAssignment } from './other-assignment';
import { AssignmentDetail } from './assignment-detail';
import { AssignmentStatus } from './assignment-status';
import { AssignmentHeader } from './assignment-header';
import { useParams } from 'next/navigation';

export function Overall() {  
    const params = useParams<{id: string}>();

    return (
        <div className="bg-background min-h-screen pb-12 space-y-8">
            {/* ヘッダー */}
            <AssignmentHeader id={params.id}/>
            
            <div className="container m-auto px-4 max-w-screen-xl space-y-8">

                {/* 課題の詳細 */}
                <AssignmentDetail id={params.id}/>

                {/* 提出（学生用） */}
                <Submissions id={params.id}/>

                {/* 評定（教員用） */}
                <Evaluated />

                {/* コメント */}
                <CommentsOnAssignment id={params.id}/>

                {/* 課題の提出状況 */}
                <AssignmentStatus id={params.id}/>

                {/* その他の課題 */}
                <OtherAssignment id={params.id}/>
            </div>
        </div>
    );
};