import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { add } from "date-fns"

interface AniListAuthReqBody {
    auth_code: string
}

interface AniListAuthResBody {
    access_token: string
}

function validateAuthRequest(body: AniListAuthReqBody): boolean {
    return true
}

async function fetchAccessToken(body: AniListAuthReqBody): Promise<AniListAuthResBody> {
    const authUrl = process.env.ANILIST_API_AUTH_URI
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
    const clientSecret = process.env.ANILIST_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI

    if (!authUrl || !clientId || !clientSecret || !redirectUri) {
        throw new Error("Could not set up auth request.")
    }

    // TODO Add schema for request body
    console.log(body)
    if (!validateAuthRequest(body)) {
        throw new Error("Invalid auth request.")
    }

    const authRes = await fetch(authUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "grant_type": "authorization_code",
            "client_id": clientId,
            "client_secret": clientSecret,
            "redirect_uri": redirectUri,
            "code": body.auth_code
        })
    })

    if (authRes.status != 200) {
        const json = await authRes.json()

        console.error({
            status: authRes.status,
            statusText: authRes.statusText,
            json
        })

        throw new Error("Could not authorize with AniList API")
    }

    // TODO Add schema for response body
    const json: AniListAuthResBody = await authRes.json()

    return json
}

function setAccessTokenCookie(accessToken: string) {
    console.log(accessToken)

    cookies().set({
        name: "anilist-access-token",
        value: accessToken,
        httpOnly: true,
        sameSite: "strict",
        // TODO Make expires configurable
        expires: add(new Date(), { years: 1 }),
        path: "/"
    })
}

export async function POST(req: Request) {
    const body: AniListAuthReqBody = await req.json()

    const authRes: AniListAuthResBody = await fetchAccessToken(body)

    setAccessTokenCookie(authRes.access_token)

    return NextResponse.json({
        data: {
            message: "Successfully authorized with AniList API."
        }
    })
}
