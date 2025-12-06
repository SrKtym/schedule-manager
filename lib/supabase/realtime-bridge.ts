import { sendMessages } from "@/utils/helpers/sse";
import { serverClient } from "./server";


export async function realtimeBridge() {
    const supabaseAdmin = await serverClient();
    const channel = supabaseAdmin.channel("messages");
    channel.on("postgres_changes", 
        { 
            event: "INSERT",
            schema: "main",
            table: "messages"
        }, 
        (payload) => {
            const { subject, body, isread, userId } = payload.new;
            sendMessages(userId, {
                subject,
                body,
                isread
            });
        }
    );

    channel.subscribe();
}
