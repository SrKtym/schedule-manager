import { z } from 'zod'

export const formSchema = z.object({
    name: z.string().min(1, {message: 'ユーザーネームは必須です。'}),
    email: z.string().email({message: 'メールアドレスは必須です。'}),
    password: z.string().min(8, {message: 'パスワードは8文字以上です。'}),
});