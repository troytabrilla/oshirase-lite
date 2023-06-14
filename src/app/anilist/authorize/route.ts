import { redirect } from "next/navigation"

import getAniListAccessToken from "@/lib/auth/get-anilist-access-token"
import setAccessTokenCookie from "@/lib/auth/set-anilist-access-token-cookie"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")

    const { access_token, expires_in } = await getAniListAccessToken({
        auth_code: code,
    })

    setAccessTokenCookie(access_token, expires_in)

    // TODO Redirect to latest
    redirect("/")
}
