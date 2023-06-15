import { NextRequest, NextResponse } from "next/server"
import _debug from "debug"

import fetchViewer from "./lib/fetchViewer"

const debug = _debug("nintei/src/app/api/anilist/anime/list/route")

const listQuery = `query ListQuery(
    $user_id: Int
    $type: MediaType
    $status_in: [MediaListStatus]
) {
    MediaListCollection(userId: $user_id, type: $type, status_in: $status_in) {
        lists {
            name
            status
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

// TODO Fetch from anilist graphql api
export async function GET(req: NextRequest) {
    const accessToken = req.cookies.get("anilist-access-token")

    if (!accessToken) {
        throw new Error("No AniList API access token")
    }

    const viewer = await fetchViewer(accessToken.value)

    console.log("viewer?!", viewer)

    return NextResponse.json({})
}
