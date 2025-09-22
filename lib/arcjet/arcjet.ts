import arcjet, { shield } from "@arcjet/next";
import { env } from "@/env";

export const aj = arcjet({
    key: env.ARCJET_KEY,
    characteristics: ["userId"],
    rules: [
        shield({
            mode: "LIVE"
        })
    ]
});

