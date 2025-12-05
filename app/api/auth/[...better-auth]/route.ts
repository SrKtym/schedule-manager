import { auth } from "@/lib/better-auth/auth";
import { aj } from "@/lib/arcjet/arcjet";
import ip from "@arcjet/ip";
import {
    type ArcjetDecision,
    type BotOptions,
    type EmailOptions,
    type ProtectSignupOptions,
    type SlidingWindowRateLimitOptions,
    detectBot,
    protectSignup,
    slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { fetchSession } from "@/utils/getters/auth";

const emailOptions = {
    mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    // Block emails that are disposable, invalid, or have no MX records
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const botOptions = {
    mode: "LIVE",
    // configured with a list of bots to allow from
    // https://arcjet.com/bot-list
    allow: [], // prevents bots from submitting the form
} satisfies BotOptions;

const rateLimitOptions = {
    mode: "LIVE",
    interval: "2m", // counts requests over a 2 minute sliding window
    max: 5, // allows 5 submissions within the window
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
    email: emailOptions,
    // uses a sliding window rate limit
    bots: botOptions,
    // It would be unusual for a form to be submitted more than 5 times in 10
    // minutes from the same IP address
    rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;


async function protect(req: NextRequest): Promise<ArcjetDecision> {
    const session = await fetchSession();
    // If the user is logged in we'll use their ID as the identifier. This
    // allows limits to be applied across all devices and sessions (you could
    // also use the session ID). Otherwise, fall back to the IP address.
    let userId: string;
    if (session?.user.id) {
        userId = session.user.id;
    } else {
        userId = ip(req) || "127.0.0.1"; // Fall back to local IP if none
    }

    // If this is a signup then use the special protectSignup rule
    // See https://docs.arcjet.com/signup-protection/quick-start
    if (req.nextUrl.pathname.startsWith("/api/auth/sign-up")) {
        // Better-Auth reads the body, so we need to clone the request preemptively
        const body = await req.clone().json();

        // If the email is in the body of the request then we can run
        // the email validation checks as well. See
        // https://www.better-auth.com/docs/concepts/hooks#example-enforce-email-domain-restriction
        if (typeof body.email === "string") {
            return aj
                .withRule(protectSignup(signupOptions))
                .protect(req, { email: body.email, userId });
        } else {
            // Otherwise use rate limit and detect bot
            return aj
                .withRule(detectBot(botOptions))
                .withRule(slidingWindow(rateLimitOptions))
                .protect(req, { userId });
        }
    } else {
        // For all other auth requests
        return aj
            .withRule(detectBot(botOptions))
            .protect(req, { userId });
    }
}

const authHandlers = toNextJsHandler(auth);
export const { GET } = authHandlers;

// Wrap the POST handler with Arcjet protections
export const POST = async (req: NextRequest) => {
    const decision = await protect(req);
    console.log("Arcjet Decision:", decision.reason);

    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
        } else if (decision.reason.isEmail()) {
            let message: string;

            if (decision.reason.emailTypes.includes("INVALID")) {
                message = "メールアドレスの形式が不正です";
            } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                message = "使い捨てのメールアドレスは使用できません。";
            } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                message = "ご使用のメールドメインにMXレコードが設定されていません。";
            } else {
            // This is a catch all, but the above should be exhaustive based on the
            // configured rules.
                message = "無効なメールアドレスです。";
            }
            return NextResponse.json({ message }, { status: 400 });
        } else {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }
    return authHandlers.POST(req);
};