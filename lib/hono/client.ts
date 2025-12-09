'use client';

import { clientEnv } from "@/env/client";
import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

export const client = hc<AppType>(clientEnv.NEXT_PUBLIC_APP_URL);
