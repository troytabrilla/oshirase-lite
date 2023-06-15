import { NextURL } from "next/dist/server/web/next-url"
import { NextRequest } from "next/server"

type URL = string | NextURL
type SameSite = boolean | "lax" | "strict" | "none" | undefined

export default function setupRedirect(req: NextRequest): {
    url: URL
    sameSite: SameSite
} {
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
