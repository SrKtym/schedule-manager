import arcjet, { filter, shield } from "@arcjet/next";
import { env } from "@/env";

export const aj = arcjet({
    key: env.ARCJET_KEY,
    characteristics: ["userId"],
    rules: [
        filter({
            deny: ["ip.src.vpn or ip.src.tor"],
            mode: "LIVE"
        }),
        shield({
            mode: "LIVE"
        })
    ]
});

