import _debug from "debug"

import callAniListAPI from "./call-anilist-api"
import { listSchema } from "../schemas/anilist"
import { IAnime, IMediaListStatus } from "@/app/shared/types/anilist"

const debug = _debug("nintei/src/app/api/anilist/anime/list/lib/fetchList")

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
    statusIn: IMediaListStatus[]
): Promise<IAnime[]> {
    const url = process.env.ANILIST_GRAPHQL_API_URI

    if (!url) {
        throw new Error("Could not find AniList GraphQL API endpoint")
    }

    const data = await callAniListAPI(accessToken, LIST_QUERY, {
        user_id: userId,
        type: "ANIME",
        status_in: statusIn,
    })

    const { value, error } = listSchema.validate(data)

    if (error) {
        debug({ error }, "fetchList")
        throw new Error("Invalid list")
    }

    const list: IAnime[] = value.data.MediaListCollection.lists.reduce(
        (memo: IAnime[], list: any) => {
            const flattened = list.entries.map((entry: any) => ({
                media_id: entry.media.id,
                media_type: entry.media.type,
                format: entry.media.format,
                season: entry.media.season,
                season_year: entry.media.seasonYear,
                title: entry.media.title.romaji,
                english_title: entry.media.title.english,
                image: entry.media.coverImage?.large,
                episodes: entry.media.episodes,
                status: entry.status,
                score: entry.score,
                progress: entry.progress,
            }))

            return memo.concat(flattened)
        },
        []
    )

    return list
}
