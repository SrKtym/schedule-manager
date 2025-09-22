'use client';

import { Switch } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";
import { env } from "@/env";
import { useCurrentTheme } from "@/contexts/theme-context";
import { useSessionUserData } from "@/contexts/user-data-context";

export function ThemeButton() {
    const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
    const theme = useCurrentTheme();
    const email = useSessionUserData().email;

    return (
        <Switch
            aria-label="theme button"
            color="secondary"
            size="md"
            title={theme === 'light' ? 'ダークモードに変更' : 'ライトモードに変更'}
            defaultSelected={theme === 'light' ? false : true}
            thumbIcon={({isSelected}) => isSelected ? 
                <Moon color="cyan" /> : <Sun color="orange" />
            }
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
                        email: email as string,
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