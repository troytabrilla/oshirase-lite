import { NextRequest, NextResponse } from "next/server"
import { add } from "date-fns"

import getAccessToken from "./lib/get-access-token"
import setupRedirect from "./lib/setup-redirect"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const { access_token, expires_in } = await getAccessToken({
        auth_code: searchParams.get("code"),
    })

    const { url, sameSite } = setupRedirect(req)

    const res = NextResponse.redirect(url)

    res.cookies.set({
        name: "anilist-access-token",
        value: access_token,
        httpOnly: true,
        sameSite: sameSite,
        expires: add(new Date(), { seconds: expires_in }),
        path: "/",
    })

    return res
}
