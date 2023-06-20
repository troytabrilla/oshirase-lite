import { NextRequest, NextResponse } from "next/server"
import { NextURL } from "next/dist/server/web/next-url"
import { add } from "date-fns"

import { AniListAuth } from "./models/anilist-auth"
import errorHandler from "../../lib/error-handler"
import { BadRequest } from "../../lib/errors"

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { searchParams } = new URL(req.url)

        const auth = new AniListAuth()
        await auth.fetch({ auth_code: searchParams.get("code") })

        const data = auth.serialize()

        if (!data) {
            throw new BadRequest("Could not retrieve access token")
        }

        const { access_token, expires_in } = data

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
    } catch (err: any) {
        return errorHandler(err)
    }
}

type URL = string | NextURL
type SameSite = boolean | "lax" | "strict" | "none" | undefined

const setupRedirect = (
    req: NextRequest
): {
    url: URL
    sameSite: SameSite
} => {
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
