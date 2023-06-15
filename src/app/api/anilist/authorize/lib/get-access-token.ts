import _debug from "debug"

import { requestSchema, responseSchema } from "../schemas/auth"

const debug = _debug("nintei/src/lib/models/anilist/anilist-auth")

interface IAniListAuthReqBody {
    auth_code: string
}

interface IAniListAuthResBody {
    access_token: string
    expires_in: number
}

function validateAuthRequest(body: unknown): IAniListAuthReqBody {
    const { error, value } = requestSchema.validate(body)

    if (error) {
        debug({ error }, "validateAuthRequest")
        throw new Error("Invalid auth request")
    }

    return value as IAniListAuthReqBody
}

async function validateAuthResponse(
    res: Response
): Promise<IAniListAuthResBody> {
    if (res.status != 200) {
        debug(
            {
                status: res.status,
                statusText: res.statusText,
                json: await res.json(),
            },
            "validateAuthResponse"
        )

        throw new Error("Could not authorize with AniList API")
    }

    const body = await res.json()

    const { error, value } = responseSchema.validate(body)

    if (error) {
        debug({ error }, "validateAuthResponse")
        throw new Error("Invalid auth response")
    }

    return value as IAniListAuthResBody
}

export default async function getAccessToken(
    body: unknown
): Promise<IAniListAuthResBody> {
    if (
        !process.env.ANILIST_OAUTH_ACCESS_TOKEN_URI ||
        !process.env.ANILIST_OAUTH_CLIENT_ID ||
        !process.env.ANILIST_OAUTH_CLIENT_SECRET ||
        !process.env.ANILIST_OAUTH_REDIRECT_URI
    ) {
        throw new Error("Could not set up auth request")
    }

    const accessTokenUri = process.env.ANILIST_OAUTH_ACCESS_TOKEN_URI
    const clientId = process.env.ANILIST_OAUTH_CLIENT_ID
    const clientSecret = process.env.ANILIST_OAUTH_CLIENT_SECRET
    const redirectUri = process.env.ANILIST_OAUTH_REDIRECT_URI

    const validatedReqBody: IAniListAuthReqBody = validateAuthRequest(body)

    const res = await fetch(accessTokenUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code: validatedReqBody.auth_code,
        }),
    })

    return validateAuthResponse(res)
}
