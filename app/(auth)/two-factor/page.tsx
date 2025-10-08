import { get2faCookie, getSession } from '@/utils/getter';
import { db } from '@/lib/drizzle';
import { TwoFactorSettings } from '@/components/auth/two-factor/two-factor-settings';
import { redirect } from 'next/navigation';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { Metadata } from "next";
import { FormTabs } from '@/components/auth/two-factor/form-tabs';


export const metadata: Metadata = {
    title: '2要素認証'
}


export default async function TwoFactorPage() {
    const session = await getSession();
    const cookie = await get2faCookie();

    if (session) {
        const user = await db.query.users.findFirst({
            where: (users, {eq}) => (eq(users.id, session.session.userId))
        });

        return (
            <div className='flex flex-col items-center justify-center space-y-4'>
                <div className='flex flex-col items-center justify-center w-full max-w-[480px] space-y-5 p-5 rounded-3xl bg-white'>
                    <div className='space-y-3'>
                        <h1 className="text-center text-xl font-medium">
                            2要素認証の設定を行ってください。
                        </h1>
                        <div className='flex items-center justify-center space-x-3'>
                            <p>現在のステータス: </p>
                            {user?.twoFactorEnabled ? 
                                <div className='flex'>
                                    <ShieldCheck className='text-green-500'/>
                                    <p className='text-green-500'>
                                        有効
                                    </p>
                                </div> : 
                                <div className='flex'>
                                    <ShieldAlert className='text-red-500'/>
                                    <p className='text-red-500'>
                                        無効
                                    </p>
                                </div>}
                        </div>
                    </div>
                    <TwoFactorSettings twoFactorEnabled={user?.twoFactorEnabled}/>
                </div>
            </div>
        );
    } else if (cookie) {
        return <FormTabs />;
    } else {
        redirect('/');
    }
}