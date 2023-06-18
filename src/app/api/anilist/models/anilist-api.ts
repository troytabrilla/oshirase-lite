import axios from "axios"

import {
    IMedia,
    EMediaSeason,
    EMediaFormat,
    EMediaListStatus,
    LooseObject,
    EMediaType,
} from "@/app/shared/types/anilist"
import { viewerSchema, listSchema } from "../schemas/anilist"

interface IViewer {
    id: number
}

abstract class AniListModel<T> {
    accessToken: string
    data: any

    constructor(accessToken: string) {
        this.accessToken = accessToken
    }

    protected async query(
        query: string,
        variables?: LooseObject
    ): Promise<any> {
        const res = await axios({
            method: "POST",
            url: process.env.ANILIST_GRAPHQL_API_URI,
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            data: {
                query,
                variables,
            },
        })

        return res.data
    }

    abstract fetch(variables?: LooseObject): Promise<void>

    abstract serialize(): T | null
}

export class Viewer extends AniListModel<IViewer> {
    viewerQuery: string = `query ViewerQuery {
        Viewer {
            id
        }
    }`

    async fetch(): Promise<void> {
        const json = await this.query(this.viewerQuery)

        const { value, error } = viewerSchema.validate(json)

        if (error) {
            throw error
        }

        this.data = value.data
    }

    serialize(): IViewer | null {
        if (!this.data) {
            return null
        }

        return this.data.Viewer as IViewer
    }
}

export interface IListQueryVariables {
    userId: number
    mediaType: EMediaType
    statusIn?: EMediaListStatus[]
}

export class MediaList extends AniListModel<IMedia[]> {
    listQuery: string = `query ListQuery(
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

    async fetch(variables: IListQueryVariables): Promise<void> {
        let { userId, mediaType, statusIn } = variables

        if (!statusIn || statusIn.length === 0) {
            statusIn = [EMediaListStatus.CURRENT]
        }

        const json = await this.query(this.listQuery, {
            user_id: userId,
            type: mediaType,
            status_in: statusIn,
        })

        const { value, error } = listSchema.validate(json)

        if (error) {
            throw error
        }

        this.data = value.data
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
