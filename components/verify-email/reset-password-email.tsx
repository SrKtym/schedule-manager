import { notoSansJP } from '../../public/fonts/fonts';
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



export function ResetPasswordEmail({
    email,
    url
}: {
    email: string, 
    url: string
}) {
    return (
        <Html lang='ja'>
            <Head />
            <Preview>
                パスワードの変更
            </Preview>
            <Tailwind>
                <Body className={`${notoSansJP.className} `}>
                    <Container className='w-full max-w-[480px] p-4 space-y-3 border rounded-3xl border-solid border-gray-300'>
                        <Heading className='text-center text-xl'>
                            パスワードの変更
                        </Heading>
                        <Text className='text-justify text-base space-y-3'>
                            <span>
                                以下のリンクに進みパスワードを変更してください。
                            </span>
                            <p className='text-primary'>
                                {url}
                            </p>
                        </Text>
                        <Hr className='w-auto border border-solid border-gray-300'/>
                        <Text className='text-justify text-base text-gray-500'>
                            このメールは
                            <span className='text-primary'>
                                {email}
                            </span>
                            に送信されました。心当たりがない場合は、無視してください。
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}