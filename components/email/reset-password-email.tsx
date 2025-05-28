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



export function ResetPasswordEmail(email: string, url: string) {
    return (
        <Html>
            <Head>
                <Preview>
                    パスワードの変更
                </Preview>
                <Tailwind>
                    <Body className={`${notoSansJP.className} `}>
                        <Container className='w-auto max-w-[480px] mx-auto px-auto space-y-3 border rounded-3xl border-solid border-gray-300'>
                            <Heading className='text-center text-xl'>
                                パスワードの変更
                            </Heading>
                            <Text className='text-base'>
                                以下のリンクに進みパスワードを変更してください。
                                <span className='text-blue-500'>
                                    {url}
                                </span>
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