import axios, { AxiosResponse } from "axios"
import _debug from "debug"

import { requestSchema, responseSchema } from "../schemas/auth"

const debug = _debug(
    "oshirase-lite/src/app/api/anilist/authorize/lib/get-access-token"
)

interface IAniListAuthReqBody {
    auth_code: string
}

interface IAniListAuthResBody {
    access_token: string
    expires_in: number
}

const getAccessToken = async (body: unknown): Promise<IAniListAuthResBody> => {
    const validatedReqBody: IAniListAuthReqBody = validateAuthRequest(body)

    const res = await axios({
        method: "POST",
        url: process.env.ANILIST_OAUTH_ACCESS_TOKEN_URI,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        data: {
            grant_type: "authorization_code",
            client_id: process.env.ANILIST_OAUTH_CLIENT_ID,
            client_secret: process.env.ANILIST_OAUTH_CLIENT_SECRET,
            redirect_uri: process.env.ANILIST_OAUTH_REDIRECT_URI,
            code: validatedReqBody.auth_code,
        },
    })

    return validateAuthResponse(res)
}

const validateAuthRequest = (body: unknown): IAniListAuthReqBody => {
    const { value, error } = requestSchema.validate(body)

    if (error) {
        throw error
    }

    return value as IAniListAuthReqBody
}

const validateAuthResponse = (res: AxiosResponse): IAniListAuthResBody => {
    if (res.status != 200) {
        debug(res.data)
        throw new Error("Could not authorize with AniList API")
    }

    const { value, error } = responseSchema.validate(res.data)

    if (error) {
        throw error
    }

    return value as IAniListAuthResBody
}

export default getAccessToken
