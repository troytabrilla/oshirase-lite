import { cookies } from "next/headers"
import axios from "axios"
import _debug from "debug"

import { resultSchema } from "../schemas/anime-list"
import { IAnime } from "@/app/shared/types/anilist"

const debug = _debug("oshirase-lite/src/app/home/models/anime-list")

export default class AnimeList {
    _animeList: IAnime[]

    constructor() {
        this._animeList = []
    }

    async fetch() {
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

        let res
        try {
            res = await axios({
                method: "GET",
                url: `${domain}/api/anilist/anime/list`,
                headers: headers,
            })
        } catch (err) {
            debug(err)
            throw new Error("Could not call AniList API")
        }

        const { value, error } = resultSchema.validate(res.data)

        if (error) {
            debug(error)
            throw new Error("Invalid list")
        }

        this._animeList = value.data.anime_list as IAnime[]

        return this._animeList
    }

    map(cb: (anime: IAnime) => any) {
        return this._animeList.map(cb)
    }
}
