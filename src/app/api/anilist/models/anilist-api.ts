import axios, { AxiosResponse } from "axios"
import joi from "joi"

import {
    IMedia,
    EMediaSeason,
    EMediaFormat,
    EMediaListStatus,
    LooseObject,
    EMediaType,
} from "@/app/shared/types/anilist"
import { viewerSchema, listSchema } from "../schemas/anilist"
import { requestSchema, responseSchema } from "../schemas/auth"
import { BadRequest } from "../../lib/errors"

interface IAniListAPI<T, O extends LooseObject> {
    fetch(options?: O): Promise<void>
    serialize(): T | null
}

interface IAniListAuthReqBody {
    auth_code: string
}

interface IAniListAuthResBody {
    access_token: string
    expires_in: number
}

export class Auth
    implements IAniListAPI<IAniListAuthResBody, IAniListAuthReqBody>
{
    protected data?: IAniListAuthResBody
    private authCode: string

    constructor(authCode: string) {
        this.authCode = authCode
    }

    async fetch(): Promise<void> {
        const validatedAuthReq: IAniListAuthReqBody = this.validateAuthRequest({
            auth_code: this.authCode,
        })

        const res = await fetch(
            process.env.ANILIST_OAUTH_ACCESS_TOKEN_URI as string,
            {
                grant_type: "authorization_code",
                client_id: process.env.ANILIST_OAUTH_CLIENT_ID,
                client_secret: process.env.ANILIST_OAUTH_CLIENT_SECRET,
                redirect_uri: process.env.ANILIST_OAUTH_REDIRECT_URI,
                code: validatedAuthReq.auth_code,
            }
        )

        this.data = this.validateAuthResponse(res)
    }

    validateAuthRequest(req: IAniListAuthReqBody): IAniListAuthReqBody {
        const value = validate(req, requestSchema)

        return value as IAniListAuthReqBody
    }

    validateAuthResponse(res: AxiosResponse): IAniListAuthResBody {
        if (res.status != 200) {
            throw new BadRequest("Could not authorize with AniList API")
        }

        const value = validate(res.data, responseSchema)

        return value as IAniListAuthResBody
    }

    serialize(): IAniListAuthResBody | null {
        if (!this.data) {
            return null
        }

        return this.data
    }
}

const fetch = async (
    url: string,
    data: LooseObject,
    headers?: LooseObject
): Promise<AxiosResponse> => {
    const res = await axios({
        method: "POST",
        url,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...headers,
        },
        data,
    })

    return res
}

const validate = (data: any, schema: joi.Schema): unknown => {
    const { value, error } = schema.validate(data)

    if (error) {
        throw error
    }

    return value
}

abstract class AniListAPIAuthed<T, O extends LooseObject>
    implements IAniListAPI<T, LooseObject>
{
    protected data: any
    private accessToken: string
    private query: string
    private schema: joi.Schema

    constructor(accessToken: string, query: string, schema: joi.Schema) {
        this.accessToken = accessToken
        this.query = query
        this.schema = schema
    }

    async fetch(options?: O): Promise<void> {
        const res = await fetch(
            process.env.ANILIST_GRAPHQL_API_URI as string,
            {
                query: this.query,
                variables: options,
            },
            {
                Authorization: `Bearer ${this.accessToken}`,
            }
        )

        const value = validate(res.data, this.schema) as { data: any }

        this.data = value.data
    }

    abstract serialize(): T | null
}

interface IViewer {
    id: number
}

export class Viewer extends AniListAPIAuthed<IViewer, never> {
    constructor(accessToken: string) {
        const viewerQuery: string = `query ViewerQuery {
            Viewer {
                id
            }
        }`
        super(accessToken, viewerQuery, viewerSchema)
    }

    serialize(): IViewer | null {
        if (!this.data) {
            return null
        }

        return this.data.Viewer as IViewer
    }
}

export interface IListQueryVariables {
    user_id: number
    type: EMediaType
    status_in: EMediaListStatus[]
}

export class MediaList extends AniListAPIAuthed<IMedia[], IListQueryVariables> {
    constructor(accessToken: string) {
        const listQuery: string = `query ListQuery(
            $user_id: Int
            $type: MediaType
            $status_in: [MediaListStatus]
        ) {
            MediaListCollection(userId: $user_id, type: $type, status_in: $status_in) {
                lists {
                    entries {
                        media {
                            id
                            type
                            format
                            season
                            seasonYear
                            title {
                                romaji
                                english
                            }
                            coverImage {
                                large
                            }
                            episodes
                        }
                        status
                        score
                        progress
                    }
                }
            }
        }`
        super(accessToken, listQuery, listSchema)
    }

    serialize(): IMedia[] | null {
        if (!this.data) {
            return null
        }

        const list: IMedia[] = this.data.MediaListCollection.lists.reduce(
            (memo: IMedia[], list: any) => {
                const flattened: IMedia[] = list.entries.map((entry: any) => ({
                    media_id: entry.media.id as number,
                    media_type:
                        EMediaType[entry.media.type as keyof typeof EMediaType],
                    format: EMediaFormat[
                        entry.media.format as keyof typeof EMediaFormat
                    ],
                    season: EMediaSeason[
                        entry.media.season as keyof typeof EMediaSeason
                    ],
                    season_year: entry.media.seasonYear as number,
                    title: entry.media.title.romaji as string,
                    english_title: entry.media.title.english as
                        | string
                        | undefined,
                    image: entry.media.coverImage?.large as string | undefined,
                    episodes: entry.media.episodes as number | undefined,
                    status: EMediaListStatus[
                        entry.status as keyof typeof EMediaListStatus
                    ],
                    score: entry.score as number | undefined,
                    progress: entry.progress as number | undefined,
                }))

                return memo.concat(flattened)
            },
            []
        )

        return list
    }
}
