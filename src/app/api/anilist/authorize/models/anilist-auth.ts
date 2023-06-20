import axios, { AxiosResponse } from "axios"
import joi from "joi"

import { requestSchema, responseSchema } from "../schemas/auth"
import { BadRequest } from "@/app/api/lib/errors"

interface IAniListAuthReq {
    auth_code: string
}

interface IAniListAuthRes {
    access_token: string
    expires_in: number
}

export class AniListAuth {
    private data?: IAniListAuthRes

    async fetch(body: unknown): Promise<void> {
        const validatedAuthReq: IAniListAuthReq = this.validateAuthRequest(body)

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
                code: validatedAuthReq.auth_code,
            },
        })

        this.data = this.validateAuthResponse(res.data)
    }

    validateAuthRequest(body: unknown): IAniListAuthReq {
        const value = this.validate(body, requestSchema)

        return value.data as IAniListAuthReq
    }

    validateAuthResponse(res: AxiosResponse): IAniListAuthRes {
        if (res.status != 200) {
            throw new BadRequest("Could not authorize with AniList API")
        }

        const value = this.validate(res.data, responseSchema)

        return value.data as IAniListAuthRes
    }

    validate(data: any, schema: joi.Schema): { data: any } {
        const { value, error } = schema.validate(data)

        if (error) {
            throw error
        }

        return value
    }

    serialize(): IAniListAuthRes | null {
        if (!this.data) {
            return null
        }

        return this.data
    }
}
