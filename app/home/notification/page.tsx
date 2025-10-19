import type { Metadata } from "next";
import { fetchMessages, fetchSession } from "@/utils/getter";
import { Inbox } from "@/components/home/notification/inbox";
import { Suspense } from "react";
import { InboxSkelton } from "@/components/skeltons";
import { MessagesProvider } from "@/contexts/messages-context";

export const metadata: Metadata = {
    title: '通知'
}

export default async function NotificationPage() {
    const session = await fetchSession()
    const data = await fetchMessages(session);
    
    if (session) {
        return (
            <Suspense fallback={<InboxSkelton />}>
                <MessagesProvider 
                    email={session.user.email} 
                    messageList={data}
                >
                    <Inbox />
                </MessagesProvider>
            </Suspense>
        );
    }
}
