import axios from "axios"
import _debug from "debug"

import { EMediaType, EMediaListStatus } from "@/app/shared/types/anilist"

const debug = _debug(
    "oshirase-lite/src/app/api/anilist/anime/list/lib/call-anilist-api"
)

interface IListQueryVariables {
    user_id: number
    type: EMediaType
    status_in: EMediaListStatus[]
}

export default async function callAniListAPI(
    accessToken: string,
    query: string,
    variables?: IListQueryVariables
): Promise<unknown> {
    const url = process.env.ANILIST_GRAPHQL_API_URI

    if (!url) {
        throw new Error("Could not find AniList GraphQL API endpoint")
    }

    const res = await axios({
        method: "POST",
        url: url,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        data: {
            query,
            variables,
        },
    })

    if (res.status != 200) {
        debug(
            {
                status: res.status,
                statusText: res.statusText,
                json: res.data,
            },
            "callAniListAPI"
        )

        throw new Error("Could not call AniList API")
    }

    return res.data
}
