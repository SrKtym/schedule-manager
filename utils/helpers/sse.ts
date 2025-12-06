import { sseClients } from "@/types/main/sse-clients";

export const clientsMap = new Map<string, sseClients[]>();

export function sendMessages(userId: string, data: unknown) {
    const clients = clientsMap.get(userId) || [];
    clients.forEach(client => client.send(JSON.stringify(data)));
}