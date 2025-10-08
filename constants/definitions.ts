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

// 認証ページ
export const authSteps = [
    {title: "2要素認証の設定"}, 
    {title: "TOTP認証の設定"}, 
    {title: "パスキー認証の設定"}, 
];


// プライベートページ
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
        description: "課題の一覧を確認したり、作成・提出をしたりすることができます",
        icon: NotebookPen,
    },
];

// ナビバー
export const menuItems = [
    { key: "", label: "ホーム" },
    { key: "register", label: "履修登録" },
    { key: "schedule", label: "スケジュール" },
    { key: "notification", label: "通知" },
    { key: "course-list", label: "登録済みの講義"}
];

// データテーブル
export const targetGrade = [
    '1学年', '2学年', '3学年', '4学年'
] as const;

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
] as const;

export const week = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日'] as const;
export const period = ['1限目', '2限目', '3限目', '4限目', '5限目'] as const;
export const credit = ['1', '2', '4'] as const;
export const required = ['必修', '選択必修', '任意'] as const;
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
export const dateOptionforCalendar: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
};
export const dateOptionforSchedule: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
};
export const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'] as const;
export const hoursOfDay = Array.from({length: 24}, (_, i) => i);


// 受信箱
export const sidebarItems = [
    { icon: Inbox, label: "受信トレイ" },
    { icon: Star, label: "スター付き" },
    { icon: Clock, label: "スヌーズ中"},
    { icon: Send, label: "送信済み" },
    { icon: File, label: "下書き" },
    { icon: Trash, label: "ごみ箱" },
];

export const dateOptionforEmailTable: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
};

// 講義の詳細
export const dateOptionforAnnouncement: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
};

export const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export const attachmentType = [
    'PDFファイル',
    'Wordファイル',
    'Excelファイル',
    'PowerPointファイル'
] as const;

export const announcementType = [
    '資料',
    'アンケート',
    'その他'
] as const;



