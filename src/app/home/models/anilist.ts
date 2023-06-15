import { cookies } from "next/headers"
import _debug from "debug"

import { resultSchema } from "../schemas/anilist"
import { IAnime } from "@/app/shared/types/anilist"

const debug = _debug("nintei/src/app/home/models/anilist")

export async function fetchAnimeList(): Promise<IAnime[]> {
    const domain = process.env.DOMAIN

    if (!domain) {
        throw new Error("No domain provided")
    }

    const headers: {
        [key: string]: string
    } = {}

    const accessToken = cookies().get("anilist-access-token")
    if (accessToken) {
        headers["anilist-access-token"] = accessToken.value
    }

    const res = await fetch(`${domain}/api/anilist/anime/list`, {
        method: "GET",
        headers: headers,
    })

    if (res.status != 200) {
        debug(
            {
                status: res.status,
                statusText: res.statusText,
                json: await res.json(),
            },
            "fetch"
        )

        throw new Error("Could not call AniList API")
    }

    const data = await res.json()

    const { value, error } = resultSchema.validate(data)

    if (error) {
        debug({ error }, "fetch")
        throw new Error("Invalid list")
    }

    return value.data.anime_list as IAnime[]
}
