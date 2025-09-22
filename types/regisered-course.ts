import { attachmentType } from "@/constants/definitions";

// -------------------------------------------------------------------------------------------------
// バリデーションエラー
// -------------------------------------------------------------------------------------------------

// 講義作成アクションのバリデーションエラー
export type CourseState = {
    errors?: {
        name?: string[],
        targetGrade?: string[],
        targetFaculty?: string[],
        targetDepartment?: string[],
        week?: string[],
        period?: string[],
        credit?: string[],
        required?: string[],
        professor?: string[],
        classroom?: string[],
    }
}

// 課題作成アクションのバリデーションエラー
export type AssignmentState = {
    errors?: {
        name?: string[],
        description?: string[],
        points?: string[],
        dueDate?: string[],
        attachmentIds?: string[],
        fileType?: string[],
    }
}

// アナウンスメント作成アクションのバリデーションエラー
export type AnnouncementState = {
    errors?: {
        title?: string[],
        content?: string[],
        auther?: string[],
        courseName?: string[],
        attachmentIds?: string[],
        type?: string[],
    }
}

// -------------------------------------------------------------------------------------------------
// その他
// -------------------------------------------------------------------------------------------------

// 添付ファイル
export type AttachmentData = {
    id: string;
    name: string;
    type: typeof attachmentType[number];
    url: string;
}

// ヘッダーのタブ
export type HeaderTabKey = 'announcement' | 'assignment' | 'member';

// 課題のタブ
export type AssignmentTabKey = 'text' | 'attachments';