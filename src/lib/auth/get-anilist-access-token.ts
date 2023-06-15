import _debug from "debug"

import { requestSchema, responseSchema } from "../schemas/anilist-auth"

const debug = _debug("nintei/src/lib/anilist/auth/get-anilist-access-token")

interface AniListAuthReqBody {
    auth_code: string
}

interface AniListAuthResBody {
    access_token: string
    expires_in: number
}

function validateAuthRequest(body: unknown): AniListAuthReqBody {
    const { error, value } = requestSchema.validate(body)

    if (error) {
        debug({ error }, "validateAuthRequest")
        throw new Error("Invalid auth request")
    }

    return value as AniListAuthReqBody
}

function validateAuthResponse(body: unknown): AniListAuthResBody {
    const { error, value } = responseSchema.validate(body)

    if (error) {
        debug({ error }, "validateAuthResponse")
        throw new Error("Invalid auth response")
    }

    return value as AniListAuthResBody
}

export default async function getAniListAccessToken(
    body: unknown
): Promise<AniListAuthResBody> {
    const accessTokenUri = process.env.ANILIST_OAUTH_ACCESS_TOKEN_URI
    const clientId = process.env.ANILIST_OAUTH_CLIENT_ID
    const clientSecret = process.env.ANILIST_OAUTH_CLIENT_SECRET
    const redirectUri = process.env.ANILIST_OAUTH_REDIRECT_URI

    if (!accessTokenUri || !clientId || !clientSecret || !redirectUri) {
        throw new Error("Could not set up auth request")
    }

    // TODO Use model for auth?
    const validatedReqBody: AniListAuthReqBody = validateAuthRequest(body)

    const authRes = await fetch(accessTokenUri, {
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

    if (authRes.status != 200) {
        debug(
            {
                status: authRes.status,
                statusText: authRes.statusText,
                json: await authRes.json(),
            },
            "getAniListAccessToken"
        )

        throw new Error("Could not authorize with AniList API")
    }

    return validateAuthResponse(await authRes.json())
}
