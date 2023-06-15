import { NextRequest, NextResponse } from "next/server"
import { NextURL } from "next/dist/server/web/next-url"
import { add } from "date-fns"

import getAniListAccessToken from "@/lib/auth/get-anilist-access-token"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")

    const { access_token, expires_in } = await getAniListAccessToken({
        auth_code: code,
    })

    let url: string | NextURL
    let sameSite: "lax" | "strict"

    if (process.env.NODE_ENV === "development") {
        url = (process.env.NEXT_PUBLIC_REDIRECT_URI as string).replace(
            "/anilist/authorize",
            ""
        )
        sameSite = "lax"
    } else {
        url = req.nextUrl.clone()
        url.pathname = "/"
        sameSite = "strict"
    }

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
