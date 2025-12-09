import arcjet, { filter, shield } from "@arcjet/next";
import { serverEnv } from "@/env/server";

export const aj = arcjet({
    key: serverEnv.ARCJET_KEY,
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

