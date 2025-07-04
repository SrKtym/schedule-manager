import { notoSansJP } from '../../font/fonts';
import { 
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Tailwind,
    Text,
} from '@react-email/components';



export function OtpNotificationEmail(email: string, otpCode: string) {
    return (
        <Html>
            <Head>
                <Preview>
                    OTP確認メール
                </Preview>
                <Tailwind>
                    <Body className={`${notoSansJP.className} `}>
                        <Container className='w-auto max-w-[480px] mx-auto px-auto space-y-3 border rounded-3xl border-solid border-gray-300'>
                            <Heading className='text-center text-xl'>
                                OTP確認メール
                            </Heading>
                            <Text className='text-base'>
                                あなたのOTPコードは
                                <span className='text-blue-500'>
                                    {otpCode}
                                </span>
                                です。このコードを使用して認証を完了してください。
                            </Text>
                            <Hr className='w-auto border border-solid border-gray-300'/>
                            <Text className='text-base text-gray-500'>
                                このメールは
                                <span className='text-blue-500'>
                                    {email}
                                </span>
                                に送信されました。心当たりがない場合は、無視してください。
                            </Text>
                        </Container>
                    </Body>
                </Tailwind>
            </Head>
        </Html>
    );
}