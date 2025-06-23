import { Spinner } from "@heroui/react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center">
            <Spinner
                classNames={{label: "text-foreground mt-4"}}
                label="読み込み中…"
                variant="wave"
            />
        </div>
    );
}