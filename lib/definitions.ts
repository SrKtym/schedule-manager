// サーバーアクション
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

// スケジュールテーブル
export const days = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日'];
export const times = ['(09:00-10:30)', '(10:40-12:10)', '(13:00-14:30)', '(14:40-16:10)', '(16:20-17:50)'];


// 受信箱
export type Message = {
  id: string,
  senderEmail: string,
  receiverEmail: string,
  subject: string | null,
  body: string | null,
  isRead: boolean,
  createdAt: string
}

export const sidebarItems = [
    { icon: "lucide:inbox", label: "受信トレイ" },
    { icon: "lucide:star", label: "スター付き" },
    { icon: "lucide:clock", label: "スヌーズ中"},
    { icon: "lucide:send", label: "送信済み" },
    { icon: "lucide:file", label: "下書き" },
    { icon: "lucide:trash", label: "ごみ箱" },
];


