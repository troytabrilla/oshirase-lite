import axios from "axios"
import _debug from "debug"

import { LooseObject } from "@/app/shared/types/anilist"

const debug = _debug(
    "oshirase-lite/src/app/api/anilist/anime/list/lib/call-anilist-api"
)

export default async function callAniListAPI(
    accessToken: string,
    query: string,
    variables?: LooseObject
): Promise<unknown> {
    const url = process.env.ANILIST_GRAPHQL_API_URI

    if (!url) {
        throw new Error("Could not find AniList GraphQL API endpoint")
    }

    try {
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

        return res.data
    } catch (err) {
        debug(err)
        throw new Error("Could not call AniList API")
    }
}
