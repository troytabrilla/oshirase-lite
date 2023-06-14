import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { add } from "date-fns"

interface AniListAuthReqBody {
    auth_code: string
}

interface AniListAuthResBody {
    access_token: string,
    expires_in: number
}

export const POST = async (req: Request) => {
    const authUrl = process.env.ANILIST_API_AUTH_URI
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
    const clientSecret = process.env.ANILIST_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI

    if (!authUrl || !clientId || !clientSecret || !redirectUri) {
        throw new Error("Could not set up auth request.")
    }

    // TODO Add schema for request body
    const data: AniListAuthReqBody = await req.json();

    console.log(data)

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
            "code": data.auth_code
        })
    })

    if (authRes.status != 200) {
        console.error(authRes.status, authRes.statusText)
        const json = await authRes.json()
        console.error(json)
        throw new Error("Could not authorize with AniList API")
    }

    // TODO Add schema for response body
    const json: AniListAuthResBody = await authRes.json()

    console.log(json.access_token, json.expires_in)

    cookies().set({
        name: "anilist-access-token",
        value: json.access_token,
        httpOnly: true,
        sameSite: "strict",
        // TODO Make expire configurable
        expires: add(new Date(), { years: 1 }),
        path: "/"
    })

    return NextResponse.json({
        data: {
            message: "Successfully authorized with AniList API."
        }
    })
}
