'use server';

import { formSchema } from '@/lib/formschema';
import { db } from './db';
import { settings } from './db/schema/public';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { cache } from 'react';


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



export async function SignUp(formData: FormData) {
    const validatedFields = formSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (validatedFields.error) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    } 
    try {
        const existingUser = await db.query.users.findFirst({
            where: (users, {eq}) => (eq(users.email, validatedFields.data.email))
        });

        if (existingUser) {
            return {
                messages: {
                    errors: "入力された認証情報はすでに使用されています。"
                }
            }
        } else {
            await auth.api.signUpEmail({
                body: {
                    name: validatedFields.data.name,
                    email: validatedFields.data.email,
                    password: validatedFields.data.password,   //scryptによるハッシュ化
                }
            });
            return {
                messages: {
                    success: validatedFields.data.email
                }
            }
        } 
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `サインアップに失敗しました。詳細: ${error.body?.message}`
                }
            }
        }
    }
}

export async function SignIn(formData: FormData) {
    const validatedFields = formSchema.omit({name: true}).safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (validatedFields.error) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    } 
    try {
        const user = await db.query.users.findFirst({
            with: {
                accounts: {
                    orderBy: (accounts, {desc}) => [desc(accounts.updatedAt)]
                }
            },
            where: (users, {eq}) => (eq(users.email, validatedFields.data.email))
        });

        if (user?.accounts[0].providerId === undefined) {
            return {
                messages: {
                    errors: '入力された認証情報は未登録です。'
                }
            }
        } else if (user?.accounts[0].providerId === 'credential') {
            const res = await auth.api.signInEmail({
                body: {
                    email: validatedFields.data.email,
                    password: validatedFields.data.password,
                    rememberMe: true,
                },
                asResponse: true
            });
            if (res.ok) {
                if (user.twoFactorEnabled !== true) {
                    if ('twoFactorRedirect' in res) {
                        return {
                            messages: {
                                success: 'signin'
                            }
                        }
                    } else {
                        return {
                            messages: {
                                success: 'twofactor'
                            }
                        }
                    }
                } else {
                    return {
                        messages: {
                            success: 'verify-otp'
                        }
                    }
                }
            } else {
                return {
                    messages: {
                        errors: '入力された認証情報に誤りがあります。'
                    }
                }
            }
        } else {
            return {
                messages: {
                    success: user?.accounts[0].providerId
                }
            };
        }
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `サインインに失敗しました。
                            詳細: ${error.body?.message}`
                }
            }
        }
    }
} 


export async function ConfirmEmail(formData: FormData) {
    const validatedField = formSchema.omit({name: true, password: true}).safeParse({
        email: formData.get('email'),
    });
    
    if (validatedField.error) {
        return {
            errors: validatedField.error.flatten().fieldErrors
        };
    } 
    try {
        const existingUser = await db.query.users.findFirst({
            where: (users, {eq}) => (eq(users.email, validatedField.data.email))
        });

        if (existingUser?.email) {
            return {
                messages: {
                    success: existingUser.email
                }
            }
        } else {
            return {
                messages: {
                    errors: '入力されたメールアドレスは未登録です。'
                }
            };
        }
    } catch (error) {
        const err = new Error('メールの送信に失敗しました。');
        return {
            messages: {
                errors: err.message
            }
        };
    }
}

export async function ResetPasswordAction(formData: FormData, token: string) {    
    const validatedField = formSchema.omit({name: true, email: true}).safeParse({
        password: formData.get('password'),
    });
    
    if (validatedField.error) {
        return {
            messages: {
                errors: validatedField.error.flatten().fieldErrors.password
            }
        };
    } 
    try {
        await auth.api.resetPassword({
            body: {
                newPassword: validatedField.data.password,
                token: token
                }   
            });
        return {
            messages: {
                success: 'パスワードの変更に成功しました。'
            }
        }
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: [`パスワードの変更に失敗しました。
                            詳細: ${error.body?.message}`]
                }
            }
        }
    }
}

export async function ConfirmPassword(formData: FormData) {
    const validatedField = formSchema.omit({name: true, email: true}).safeParse({
        password: formData.get('password'),
    });
    if (validatedField.error) {
        return {
            error: validatedField.error.flatten().fieldErrors.password
        }
    } else {
        return {
            success: validatedField.data.password
        }
    }
}

export const setTheme = cache(async (checked: boolean) => {
    await db.update(settings).set({theme: checked ? 'dark' : 'light'});
});

export const handleRowsPerPage = cache(async () => {

});





