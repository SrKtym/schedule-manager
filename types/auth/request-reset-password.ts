import type { State } from "@/types/auth/sign-up";

// パスワード再設定リクエストアクションのバリデーションエラー
export type StatePickEmail = {
    errors?: Omit<State['errors'], 'name' | 'password'>,
    messages?: {
        success?: string,
        errors?: string, 
    }
}