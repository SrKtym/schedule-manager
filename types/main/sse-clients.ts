// SSEに接続しているクライアントを識別するための型
export type sseClients = {
    clientId: string;
    userId: string;
    send: (data: any) => void
}
