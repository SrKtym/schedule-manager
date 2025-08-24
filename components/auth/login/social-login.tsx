'use client';

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { GoogleLogo } from "../../../public/logo/google-logo";
import { GithubLogo } from "../../../public/logo/github-logo";
import { XLogo } from "../../../public/logo/x-logo";
import { setThemeCookie } from "@/lib/action";


export function SocialLogin() {
    return (
        <div className="flex flex-col space-y-3">
            <Button color='primary' variant='ghost' onPress={async () => {
                await authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/home'
                });
                setThemeCookie();
            }}>
                <GoogleLogo />
                Googleで続行
            </Button>
            <Button color='primary' variant='ghost' onPress={async () => {
                await authClient.signIn.social({
                    provider: 'github',
                    callbackURL: '/home'
                });
                setThemeCookie();
            }}>
                <GithubLogo />
                GitHubで続行
            </Button>
            <Button color='primary' variant='ghost' onPress={async () => {
                await authClient.signIn.social({
                    provider: 'twitter',
                    callbackURL: '/home'
                });
                setThemeCookie();
            }}>
                <XLogo />
                X（旧Twitter）で続行
            </Button>
        </div>
    )
}