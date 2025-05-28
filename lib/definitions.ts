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

export const targetDepartment = [
    '史学科',
    '哲学科',
    '心理学科',
    '文学科',
    '経済学科',
    '経営学科',
    '法律学科',
    '政治学科',
    '教育学科',
    '社会学科',
    '社会心理学科',
    '数学科',
    '物理学科',
    '化学科',
    '生物学科',
    '地学科',
    '情報工学科',
    '機械工学科',
    '電気工学科',
    '建築学科',
    '生物資源学科',
    '森林学科',
    '医学科',
    '看護学科',
    '保健学科'
];

export const dataTableColumns = [
    {
        name: '講義名',
        key: 'name',
        sortable: true
    },
    {
        name: '対象学年',
        key: 'targetGrade',
        sortable: true
    },
    {
        name: '対象学部',
        key: 'targetFaculty',
        sortable: true
    },
    {
        name: '対象学科',
        key: 'targetDepartment',
        sortable: true
    },
    {
        name: '週',
        key: 'week',
        sortable: true
    },
    {
        name: '時限',
        key: 'period',
        sortable: true
    },
    {
        name: '単位',
        key: 'credit',
        sortable: true
    },
    {
        name: '履修要件',
        key: 'required',
        sortable: true
    },
    {
        name: '教室名',
        key: 'classroom',
        sortable: true
    },
    {
        name: '担当教員',
        key: 'professor',
        sortable: true
    }
];

export const scheduleTableHeaders = {
    columns: [
        {
            name: '月曜日',
            key: 'Monday'
        },
        {
            name: '火曜日',
            key: 'Tuesday'
        },
        {
            name: '水曜日',
            key: 'Wednesday'
        },
        {
            name: '木曜日',
            key: 'Thursday'
        },
        {
            name: '金曜日',
            key: 'Friday'
        }
    ],
    rows: [
        {
            name: '1限目',
            key: '1st'
        },
        {
            name: '2限目',
            key: '2nd'
        },
        {
            name: '3限目',
            key: '3rd'
        },
        {
            name: '4限目',
            key: '4th'
        },
        {
            name: '5限目',
            key: '5th'
        },
        {
            name: '6限目',
            key: '6th'
        },
        {
            name: '7限目',
            key: '7th'
        }
    ]
}