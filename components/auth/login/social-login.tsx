'use client';

import { authClient } from "@/lib/better-auth/auth-client";
import { Button } from "@heroui/react";
import { GoogleLogo } from "../../../public/logo/google-logo";
import { GithubLogo } from "../../../public/logo/github-logo";
import { XLogo } from "../../../public/logo/x-logo";
import { setThemeCookie } from "@/utils/action";
import { useTransition } from "react";


export function SocialLogin() {
    const [googlePending, startGoogleTransition] = useTransition();
    const [githubPending, startGithubTransition] = useTransition();
    const [twitterPending, startTwitterTransition] = useTransition();

    return (
        <div className="flex flex-col space-y-3">
            <Button 
                color='primary' 
                variant='ghost' 
                aria-disabled={googlePending}
                isLoading={googlePending}
                onPress={() => {
                    startGoogleTransition(async () => {
                        const {data, error} = await authClient.signIn.social({
                            provider: 'google',
                            callbackURL: '/home'
                        });
                        if (data || !error) {
                            setThemeCookie();
                        }
                    });
                }}
            >
                <GoogleLogo />
                Googleで続行
            </Button>
            <Button 
                color='primary' 
                variant='ghost' 
                aria-disabled={githubPending}
                isLoading={githubPending}
                onPress={() => {
                    startGithubTransition(async () => {
                        const {data, error} = await authClient.signIn.social({
                            provider: 'github',
                            callbackURL: '/home'
                        });
                        if (data || !error) {
                            setThemeCookie();
                        }
                    });
                }}
            >
                <GithubLogo />
                GitHubで続行
            </Button>
            <Button 
                color='primary' 
                variant='ghost' 
                aria-disabled={twitterPending}
                isLoading={twitterPending}
                onPress={() => {
                    startTwitterTransition(async () => {
                        const {data, error} = await authClient.signIn.social({
                            provider: 'twitter',
                            callbackURL: '/home'
                        });
                        if (data || !error) {
                            setThemeCookie();
                        }
                    });
                }}
            >
                <XLogo />
                X（旧Twitter）で続行
            </Button>
        </div>
    )
}