import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/button";
import { GoogleLogo } from "../logo/google-logo";
import { GithubLogo } from "../logo/github-logo";
import { XLogo } from "../logo/x-logo";


export function SocialLogin() {
    return (
        <div className="flex flex-col space-y-3">
            <Button color='primary' variant='ghost' onPress={async () => {
                await authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/home'
                });
            }}>
                <GoogleLogo />
                Googleで続行
            </Button>
            <Button color='primary' variant='ghost' onPress={async () => {
                await authClient.signIn.social({
                    provider: 'github',
                    callbackURL: '/home'
                });
            }}>
                <GithubLogo />
                GitHubで続行
            </Button>
            <Button color='primary' variant='ghost' onPress={async () => {
                await authClient.signIn.social({
                    provider: 'twitter',
                    callbackURL: '/home'
                });
            }}>
                <XLogo />
                X（旧Twitter）で続行
            </Button>
        </div>
    )
}