import { 
    announcementType,
    attachmentType,
    credit, 
    period, 
    required, 
    department,
    faculty, 
    grade, 
    week, 
    attachmentIsRelatedTo
} from "@/constants/definitions";
import { objectValues } from "@/utils/helpers/register";
import { z } from "zod/v4";

// ログイン
export const logInSchema = z.object({
    name: z.string().min(1, {error: 'ユーザーネームは必須です。'}),
    email: z.email({error: 'メールアドレスは必須です。'}),
    password: z.string().min(8, {error: 'パスワードは8文字以上です。'}),
});

// スケジュール作成
export const scheduleSchema = z.object({
    title: z.string().transform((value) => value === '' ? 'no title' : value),
    description: z.string(),
    start: z
        .iso
        .datetime({error: '日時をすべて選択してください。'})
        .transform((value) => new Date(value))
        .refine((value) => new Date() < value, {
            error: '過去の日時は選択できません。',
            path: ['start']
        }),
    end: z
        .iso
        .datetime({error: '日時をすべて選択してください。'})
        .transform((value) => new Date(value)),
    color: z.string().regex(/^#[0-9a-f]{6}$/i),
}).check((ctx) => {
    if (ctx.value.end < ctx.value.start) {
        ctx.issues.push({
            input: [ctx.value.start, ctx.value.end],
            code: 'custom',
            message: '開始日時は終了日時よりも前でなければなりません。',
            path: ['start', 'end'],
        });
    }
});

// 課題作成
export const createAssignmentSchema = z.object({
    title: z.string().min(1, {error: '課題名は必須です。'}),
    courseName: z.string(),
    description: z.string().min(1, {error: '説明文は必須です。'}),
    points: z.string({error: '点数は必須です。'}).transform((value) => parseInt(value)),
    dueDate: z
        .iso
        .date({error: '日時をすべて選択してください。'})
        .transform((value) => new Date(value))
        .refine((value) => new Date() < value, {
            error: '過去の日時は選択できません。',
            path: ['dueDate']
        }),
    attachmentIds: z.array(z.string()).nullable(),
    fileType: z.enum(attachmentType).nullable(),
});

// アナウンスメント作成
export const createAnnouncementSchema = z.object({
    title: z.string().min(1, {error: 'タイトルは必須です。'}),
    content: z.string().min(1, {error: '内容は必須です。'}),
    courseName: z.string(),
    type: z.enum(announcementType, {error: 'タイプは必須です。'}),
});

// 講義作成
export const createCourseSchema = z.object({
    name: z.string().min(1, {error: '講義名は必須です。'}),
    targetGrade: z.enum(grade),
    targetFaculty: z.enum(faculty),
    targetDepartment: z.enum(department["全学部"]),
    week: z.enum(week),
    period: z.enum(period),
    credit: z.enum(credit),
    required: z.enum(required),
    professor: z.string().min(1, {error: '教授名は必須です。'}),
    classroom: z.string().regex(/^L[1-9][0-9]{2}$/, {error: '教室名は半角英数字で入力してください。'}),
}).check((ctx) => {
    const departmentList = [...objectValues(department, ctx.value.targetFaculty)];
    if (!departmentList.includes(ctx.value.targetDepartment)) {
        ctx.issues.push({
            input: ctx.value.targetDepartment,
            code: 'custom',
            message: '選択された学部に対応する学科を選択してください。',
            path: ['targetDepartment'],
        });
    }
});

// 課題提出
export const submitAssignmentSchema = z.object({
    assignmentId: z.string(),
    content: z.string()
        .min(1, {error: '内容は必須です。'})
        .max(2000, {error: '内容は2000文字以内で入力してください。'}),
});

// ファイルアップロード
export const uploadFileSchema = z.object({
    contentType: z.string(),
    fileId: z.uuidv4(),
    fileName: z.string()
        .min(1)
        .max(100)
        .regex(/^[^\/\\]+$/, {error: "ファイル名にスラッシュは使えません"})
        .refine(name => !name.includes(".."), {error: "ファイル名に '..' は使えません"}),
    courseName: z.enum(faculty, {error: "指定された文字列はファイル名に使えません"}),
    relatedTo: z.enum(attachmentIsRelatedTo, {error: "指定された文字列はファイル名に使えません"}),
});