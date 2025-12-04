import type { State } from "@/types/auth/sign-up";

// パスワード再設定アクションのバリデーションエラー
export type StatePickPassword = {
    errors?: Omit<State['errors'], 'name' | 'email'>,
    messages?: {
        success?: string,
        errors?: string, 
    }
}