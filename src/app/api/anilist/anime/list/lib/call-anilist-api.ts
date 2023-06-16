import axios from "axios"

import { LooseObject } from "@/app/shared/types/anilist"

export default async function callAniListAPI(
    accessToken: string,
    query: string,
    variables?: LooseObject
): Promise<unknown> {
    const res = await axios({
        method: "POST",
        url: process.env.ANILIST_GRAPHQL_API_URI,
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
}
