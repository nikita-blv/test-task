import { createSdk } from "api-sdk";
import { env } from "@root/shared/env";
import { getAccessToken, getRefreshToken, setSession } from "@root/shared/session";


export const api = createSdk(env.baseApiUrl, getAccessToken, getRefreshToken, setSession)
