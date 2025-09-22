import { 
    announcementType,
    attachmentType,
    credit, 
    period, 
    required, 
    targetFaculty, 
    targetGrade, 
    week 
} from "@/constants/definitions";
import { targetDepartment } from "@/utils/related-to-register";
import { z } from "zod/v4";

// ログイン
export const logInSchema = z.object({
    name: z.string().min(1, {error: 'ユーザーネームは必須です。'}),
    email: z.email({error: 'メールアドレスは必須です。'}),
    password: z.string().min(8, {error: 'パスワードは8文字以上です。'}),
});

// スケジュール作成
export const scheduleSchema = z.object({
    email: z.email(),
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
    name: z.string().min(1, {error: '課題名は必須です。'}),
    courseName: z.string(),
    description: z.string().min(1, {error: '説明文は必須です。'}),
    points: z.string().transform((value) => parseInt(value)),
    dueDate: z.string().transform((value) => new Date(value)),
    attachmentIds: z.array(z.string()).optional(),
    fileType: z.enum(attachmentType).optional(),
});

// アナウンスメント作成
export const announcementSchema = z.object({
    title: z.string().min(1, {error: 'タイトルは必須です。'}),
    content: z.string().min(1, {error: '内容は必須です。'}),
    auther: z.string(),
    courseName: z.string(),
    attachmentIds: z.array(z.string()).optional(),
    type: z.enum(announcementType),
});

// 講義作成
export const createCourseSchema = z.object({
    name: z.string().min(1, {error: '講義名は必須です。'}),
    targetGrade: z.enum(targetGrade),
    targetFaculty: z.enum(targetFaculty),
    targetDepartment: z.enum(targetDepartment()),
    week: z.enum(week),
    period: z.enum(period),
    credit: z.enum(credit),
    required: z.enum(required),
    professor: z.string().min(1, {error: '教授名は必須です。'}),
    classroom: z.string().regex(/^L[1-9][0-9]{2}$/, {error: '教室名は半角英数字で入力してください。'}),
}).check((ctx) => {
    const departmentList = [...targetDepartment(ctx.value.targetFaculty)];
    if (!departmentList.includes(ctx.value.targetDepartment)) {
        ctx.issues.push({
            input: ctx.value.targetDepartment,
            code: 'custom',
            message: '選択された学部に対応する学科を選択してください。',
            path: ['targetDepartment'],
        });
    }
});