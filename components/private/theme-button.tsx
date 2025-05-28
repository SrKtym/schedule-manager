'use client';

import { Switch } from "@heroui/switch";
import { Moon, Sun } from "lucide-react";
import { setTheme } from "@/lib/action";
import { useRouter } from "next/navigation";

export function ThemeButton({theme}: {theme: 'light' | 'dark'}) {
    const router = useRouter();

    return (
        <Switch
            color="secondary"
            size="md"
            title={theme === 'light' ? 'ダークモードに変更' : 'ライトモードに変更'}
            defaultSelected={theme === 'light' ? false : true}
            thumbIcon={({isSelected}) => isSelected ? <Moon color="cyan" /> : <Sun color="orange" />}
            onChange={(e) => {
                setTheme(e.target.checked);
                router.refresh();
            }}
        >
        </Switch>
    );
}