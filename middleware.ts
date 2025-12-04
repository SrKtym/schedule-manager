import { Hono } from "hono";
import { handle } from "hono/vercel";
import { NextRequest, NextResponse } from "next/server";
import { fetchSession } from "./utils/getters/auth";
import { createMiddleware } from "@arcjet/next";
import { aj } from "./lib/arcjet/arcjet";

// nodejsランタイム

const app = new Hono()
    // 管理者ページへのアクセス制御
    .use("/admin", async (c) => {
        const req = c.req.raw as NextRequest;
        const session = await fetchSession()
        
        if(!session) {
            const url = req.nextUrl.clone();
            url.pathname = "/sign-in";
            return NextResponse.redirect(url);
        }

        const userRole = session.user.role;

        if (userRole !== "admin") {
            const url = req.nextUrl.clone();
            url.pathname = "/home";
            return NextResponse.redirect(url);
        } else {
            return NextResponse.next();
        }
    })
    // セッションがない場合、/home/*へのアクセスに対して、/sign-inへ遷移
    .use("/home/*", async (c) => {
        const req = c.req.raw as NextRequest;
        const session = await fetchSession()
        
        if(!session) {
            const url = req.nextUrl.clone();
            url.pathname = "/sign-in";
            return NextResponse.redirect(url);
        } else {
            return NextResponse.next();
        }
    })
    // セッションがある場合、/sign-in, /sign-upへのアクセスに対して，/homeへ遷移
    .use("/sign-*", async (c) => {
        const req = c.req.raw as NextRequest;
        const session = await fetchSession()

        if (!session) {
            return NextResponse.next();
        } else {
            const url = req.nextUrl.clone();
            url.pathname = "/home";
            return NextResponse.redirect(url);
        }
    })
    // その他のすべてのパス
    .all("*", () => {
        return NextResponse.next();
    });


export const middleware = handle(app);
export default createMiddleware(aj);

export const config = {
    matcher: [
        /*
            * 以下で始まるリクエストパス以外のすべてにマッチ：
            * - api（APIルート）
            * - _next/static（静的ファイル）
            * - _next/image（画像最適化ファイル）
            * - favicon.ico、sitemap.xml、robots.txt（メタデータファイル）
        */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
    ],
    runtime: 'nodejs'
}

