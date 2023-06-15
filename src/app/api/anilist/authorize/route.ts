import { NextRequest, NextResponse } from "next/server"
import { NextURL } from "next/dist/server/web/next-url"
import { add } from "date-fns"

import * as AniListAuth from "./auth.models"

type URL = string | NextURL
type SameSite = boolean | "lax" | "strict" | "none" | undefined

function setupRedirect(req: NextRequest): { url: URL; sameSite: SameSite } {
    let url: URL
    let sameSite: SameSite

    if (process.env.NODE_ENV === "development") {
        url = (process.env.ANILIST_OAUTH_REDIRECT_URI as string).replace(
            "/api/anilist/authorize",
            "/"
        )
        sameSite = "lax"
    } else {
        url = req.nextUrl.clone()
        url.pathname = "/"
        sameSite = "strict"
    }

    return { url, sameSite }
}

// TODO Add tests
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")

    const { access_token, expires_in } = await AniListAuth.authorize({
        auth_code: code,
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
