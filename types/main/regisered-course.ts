import { 
    attachmentIsRelatedTo,
    attachmentType, 
    credit, 
    department, 
    faculty, 
    grade, 
    period, 
    required, 
    week 
} from "@/constants/definitions";


// 再帰的にオブジェクトを探索し、最も深いレベルにあるreadonly配列の要素のユニオンを取り出す
export type LeafArrayElements<T> =
  T extends readonly (infer U)[]           // 配列なら U を返す
    ? U
    : T extends object                     // オブジェクトなら再帰
      ? { [K in keyof T]: LeafArrayElements<T[K]> }[keyof T]
      : never;

// 講義検索フィルター
export type Filter = {
    gradeList: typeof grade[number][],
    facultyList: typeof faculty[number][],
    departmentList: typeof department["全学部"][number][],
    weekList: typeof week[number][],
    periodList: typeof period[number][],
    creditList: typeof credit[number][],
    requiredList: typeof required[number][]
}

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
        courseName?: string[],
        attachmentIds?: string[],
        type?: string[],
    }
}

// 課題提出アクションのバリデーションエラー
export type SubmissionState = {
    errors?: {
        assignmentId?: string[],
        content?: string[]
    }
}

// -------------------------------------------------------------------------------------------------
// その他
// -------------------------------------------------------------------------------------------------

// 添付ファイル
export type AttachmentData = {
    id: string;
    name: string;
    relatedTo: typeof attachmentIsRelatedTo[number];
    type: typeof attachmentType[number];
}

// ヘッダーのタブ
export type HeaderTabKey = 'announcement' | 'assignment' | 'member';

// 課題のタブ
export type AssignmentTabKey = 'text' | 'attachments';