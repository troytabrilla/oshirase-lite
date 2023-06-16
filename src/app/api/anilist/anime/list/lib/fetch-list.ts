import _debug from "debug"

import callAniListAPI from "./call-anilist-api"
import { listSchema } from "../schemas/anilist"
import {
    IAnime,
    EMediaType,
    EMediaFormat,
    EMediaSeason,
    EMediaListStatus,
} from "@/app/shared/types/anilist"

const debug = _debug(
    "oshirase-lite/src/app/api/anilist/anime/list/lib/fetch-list"
)

const LIST_QUERY = `query ListQuery(
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

export default async function fetchList(
    accessToken: string,
    userId: number,
    statusIn?: EMediaListStatus[]
): Promise<IAnime[]> {
    if (!statusIn || statusIn.length === 0) {
        statusIn = [EMediaListStatus.CURRENT]
    }

    const data = await callAniListAPI(accessToken, LIST_QUERY, {
        user_id: userId,
        type: EMediaType.ANIME,
        status_in: statusIn,
    })

    const { value, error } = listSchema.validate(data)

    if (error) {
        debug(error)
        throw new Error("Invalid list")
    }

    const list: IAnime[] = value.data.MediaListCollection.lists.reduce(
        (memo: IAnime[], list: any) => {
            const flattened: IAnime[] = list.entries.map((entry: any) => ({
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
                english_title: entry.media.title.english as string | undefined,
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
