import { sendMessages } from "@/utils/helpers/sse";
import { supabaseAdmin } from "./server";


function realtimeBridge() {
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

realtimeBridge();