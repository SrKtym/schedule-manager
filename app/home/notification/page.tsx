import { Metadata } from "next";
import { getSession } from "@/lib/fetch";
import { EmailInbox } from "@/components/private/notification/email-inbox";


export const metadata: Metadata = {
    title: '通知'
}

export default async function NotificationPage() {
    const session = await getSession();
    if (session) {
        return <EmailInbox email={session.user.email}/>
    }
}
