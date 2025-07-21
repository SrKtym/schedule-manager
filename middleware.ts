import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

// edgeランタイム

const app = new Hono()
    // セッションがない場合、/home/*へのアクセスに対して、/sign-inへ遷移
    .on(["GET", "POST"], "/home/*", (c) => {
        const req = c.req.raw as NextRequest;
        const sessionCookie = getSessionCookie(req);
        
        if(sessionCookie) {
            return NextResponse.next();
        } else {
            const url = req.nextUrl.clone();
            url.pathname = '/sign-in';
            return NextResponse.redirect(url);
        }
    })
    // セッションがある場合、/sign-in, /sign-upへのアクセスに対して，/homeへ遷移
    .on(["GET", "POST"], "/sign-*", (c) => {
        const req = c.req.raw as NextRequest;
        const sessionCookie = getSessionCookie(req);

        if (sessionCookie) {
            const url = req.nextUrl.clone();
            url.pathname = '/home';
            return NextResponse.redirect(url);
        } else {
            return NextResponse.next();
        }
    })
    .all("*", () => {
        return NextResponse.next();
    });


export const middleware = handle(app);

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
    ]
}

