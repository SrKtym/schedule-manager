'use client';

import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import { TotpVerifyForm } from "@/components/auth/two-factor/totp-verify-form";
import { OtpVerifyForm } from "@/components/auth/two-factor/otp-verify-form";

export function FormTabs() {
    const [selected, setSelected] = useState<React.Key>('totp');
    return (
        <div className='flex flex-col items-center justify-center space-y-5 p-5 rounded-3xl bg-white'>
            <Tabs
                fullWidth
                aria-label='Tabs form'
                size='md'
                selectedKey={selected as 'totp' | 'otp'}
                onSelectionChange={setSelected}
            >
                <Tab 
                    key='totp' 
                    title='TOTP'
                >
                    <TotpVerifyForm />
                </Tab>
                <Tab 
                    key='otp' 
                    title='OTP'
                >
                   <OtpVerifyForm />
                </Tab>
            </Tabs>
        </div>
    );
}