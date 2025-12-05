'use client';

import { Switch } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useCurrentTheme } from "@/contexts/theme-context";
import { setTheme } from "@/utils/actions/main";

export function ThemeButton() {
    const theme = useCurrentTheme();

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
                const theme = await setTheme(e.target.checked);
                document.cookie = `theme=${theme}; path=/home`;
            }}
        >
        </Switch>
    );
}