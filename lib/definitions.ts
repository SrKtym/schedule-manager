import { 
    CalendarClock,
    Clock, 
    File, 
    Inbox, 
    MessagesSquare,
    NotebookPen,
    Send, 
    SquarePlus,
    Star, 
    Trash 
} from "lucide-react";
import { z } from 'zod';

// サーバーアクション(action.ts)
export type State = {
    errors?: {
        name?: string[],
        email?: string[],
        password?: string[],
    },
    messages?: {
        success?: string,
        errors?: string, 
    }
};

export type StateOmitName = {
    errors?: Omit<State['errors'], 'name'>,
    messages?: {
        success?: string,
        errors?: string, 
    }
};

export type StatePickEmail = {
    errors?: Omit<State['errors'], 'name' | 'password'>,
    messages?: {
        success?: string,
        errors?: string, 
    }
}

export const logInFormSchema = z.object({
    name: z.string().min(1, {message: 'ユーザーネームは必須です。'}),
    email: z.string().email({message: 'メールアドレスは必須です。'}),
    password: z.string().min(8, {message: 'パスワードは8文字以上です。'}),
});

// ランディングページ
export const features = [
    {
        title: "履修登録",
        description: "講義を登録し、時間割を作成することができます",
        icon: SquarePlus,
    },
    {
        title: "スケジュール管理",
        description: "スケジュールの作成・変更・削除ができます",
        icon: CalendarClock,
    },
    {
        title: "通知管理",
        description: "休講やテストの情報などについての通知があった時に、受け取ることができます",
        icon: MessagesSquare,
    },
    {
        title: "課題管理",
        description: "講義の一覧を確認したり、作成・提出をしたりすることができます",
        icon: NotebookPen,
    },
];

// プライベートページ

// ナビバー
export const menuItems = [
    { key: "", label: "ホーム" },
    { key: "register", label: "履修登録" },
    { key: "schedule", label: "スケジュール" },
    { key: "notification", label: "通知" },
    { key: "homework", label: "課題"}
];

// データテーブル
export const targetGrade = [
    '1学年', '2学年', '3学年', '4学年'
];

export const targetFaculty = [
    '文学部', 
    '経済学部', 
    '法学部', 
    '教育学部', 
    '社会学部',
    '理学部',
    '工学部',
    '農学部',
    '医学部'
];

export const targetDepartment = (faculty?: string) => {
    switch (faculty) {
        case '文学部':
            return ['史学科', '哲学科', '心理学科', '文学科']
        case '経済学部':
            return ['経済学科', '経営学科']
        case '法学部':
            return ['法律学科', '政治学科']
        case '教育学部':
            return ['教育学科']
        case '社会学部':
            return ['社会学科', '社会心理学科']
        case '理学部':
            return ['数学科', '物理学科', '化学科', '生物学科', '地学科']
        case '工学部':
            return ['情報工学科', '機械工学科', '電気工学科', '建築学科']
        case '農学部':
            return ['生物資源学科', '森林学科']
        case '医学部':
            return ['医学科', '看護学科', '保健学科']
        default:
            return [
                ...['史学科', '哲学科', '心理学科', '文学科'],
                ...['経済学科', '経営学科'],
                ...['法律学科', '政治学科'],
                ...['教育学科'],
                ...['社会学科', '社会心理学科'],
                ...['数学科', '物理学科', '化学科', '生物学科', '地学科'],
                ...['情報工学科', '機械工学科', '電気工学科', '建築学科'],
                ...['生物資源学科', '森林学科'],
                ...['医学科', '看護学科', '保健学科']
            ];
        }
};

export const week = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日'];
export const period = ['1限目', '2限目', '3限目', '4限目', '5限目'];
export const credit = ['1', '2', '4'];
export const required = ['必修', '選択必修', '任意'];
export const rows = [10, 20, 30];

export const dataTableColumns = [
    {
        name: '講義名',
        key: 'name'
    },
    {
        name: '対象学年',
        key: 'targetGrade'
    },
    {
        name: '対象学部',
        key: 'targetFaculty'
    },
    {
        name: '対象学科',
        key: 'targetDepartment'
    },
    {
        name: '週',
        key: 'week'
    },
    {
        name: '時限',
        key: 'period'
    },
    {
        name: '単位',
        key: 'credit'
    },
    {
        name: '履修要件',
        key: 'required'
    },
    {
        name: '教室名',
        key: 'classroom'
    },
    {
        name: '担当教員',
        key: 'professor'
    }
];

// 時間割
export const timeRange = ['09:00-10:30', '10:40-12:10', '13:00-14:30', '14:40-16:10', '16:20-17:50'];

// カレンダー
export const dateOption1: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
};
export const dateOption2: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
};
export const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
export const hoursOfDay = Array.from({length: 24}, (_, i) => i);

// スケジュール
export type ScheduleState = {
    error?: {
        start?: string[],
        end?: string[]
    },
    success?: string
}

export const scheduleSchema = z.object({
    email: z.string().email(),
    title: z.string().transform((value) => value === '' ? 'no title' : value),
    description: z.string(),
    start: z.string()
        .datetime({message: '日時をすべて選択してください。'})
        .transform((value) => new Date(value)),
    end: z.string()
        .datetime({message: '日時をすべて選択してください。'})
        .transform((value) => new Date(value)),
    color: z.string().regex(/^#[0-9a-f]{6}$/i),
}).superRefine((dateTime, c) => {
    if (dateTime.start < new Date()) {
        c.addIssue({
            path: ['start'],
            code: z.ZodIssueCode.custom,
            message: '過去の日付は選択できません。'
        })
    }
    if (dateTime.end < dateTime.start) {
        c.addIssue({
            path: ['end'],
            code: z.ZodIssueCode.custom,
            message: '終了日は開始日以降の日付を指定してください。'
        })
    }
})

// 受信箱
export const sidebarItems = [
    { icon: Inbox, label: "受信トレイ" },
    { icon: Star, label: "スター付き" },
    { icon: Clock, label: "スヌーズ中"},
    { icon: Send, label: "送信済み" },
    { icon: File, label: "下書き" },
    { icon: Trash, label: "ごみ箱" },
];


