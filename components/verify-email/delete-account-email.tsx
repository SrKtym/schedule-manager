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

export function DeleteAccountEmail({
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
                アカウント削除の確認
            </Preview>
            <Tailwind>
                <Body className={`${notoSansJP.className} `}>
                    <Container className='w-full max-w-[480px] p-4 space-y-3 border rounded-3xl border-solid border-gray-300'>
                        <Heading className='text-center text-xl'>
                            アカウント削除の確認
                        </Heading>
                        <Text className='text-justify text-base space-y-3'>
                            <span>
                                アカウントを削除しようとしました。ご自身で行った場合は以下のリンクに進み、アカウントの削除を完了してください。
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
                            に送信されました。心当たりがない場合は、アカウントの保護を行ってください。
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
    