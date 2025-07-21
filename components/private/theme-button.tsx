'use client';

import { Switch } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";
import { env } from "@/env";

export function ThemeButton({
    theme,
    email
}: {
    theme: string,
    email: string
}) {
    const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
    return (
        <Switch
            aria-label="theme button"
            color="secondary"
            size="md"
            title={theme === 'light' ? 'ダークモードに変更' : 'ライトモードに変更'}
            defaultSelected={theme === 'light' ? false : true}
            thumbIcon={({isSelected}) => isSelected ? <Moon color="cyan" /> : <Sun color="orange" />}
            onChange={async (e) => {
                if (e.target.checked) {
                    document.documentElement.classList.remove('light')
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                    document.documentElement.classList.add('light')
                }
                const res = await client.api.theme.$post({
                    json: {
                        email: email,
                        checked: e.target.checked
                    }
                });
                const theme = await res.json();
                document.cookie = `theme=${theme}; path=/home`;
            }}
        >
        </Switch>
    );
}