// スケジュール作成アクションのバリデーションエラー
export type ScheduleState = {
    errors?: {
        start?: string[],
        end?: string[]
    },
    messages?: {
        error?: string,
        success?: string
    }
}
