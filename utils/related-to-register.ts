export const targetDepartment = (faculty?: string) => {
    switch (faculty) {
        case '文学部':
            return ['史学科', '哲学科', '心理学科', '文学科'] as const
        case '経済学部':
            return ['経済学科', '経営学科'] as const
        case '法学部':
            return ['法律学科', '政治学科'] as const
        case '教育学部':
            return ['教育学科'] as const
        case '社会学部':
            return ['社会学科', '社会心理学科'] as const
        case '理学部':
            return ['数学科', '物理学科', '化学科', '生物学科', '地学科'] as const
        case '工学部':
            return ['情報工学科', '機械工学科', '電気工学科', '建築学科'] as const
        case '農学部':
            return ['生物資源学科', '森林学科'] as const
        case '医学部':
            return ['医学科', '看護学科', '保健学科'] as const
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
            ] as const;
        }
};