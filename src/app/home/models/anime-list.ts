import axios from "axios"
import _debug from "debug"

const logger = _debug("oshirase-lite/src/app/home/models/anime-list")

import { resultSchema } from "../schemas/anime-list"
import { IMedia, LooseObject } from "@/app/shared/types/anilist"

interface IOptions {
    accessToken?: string
}

interface IAPIResponse {
    data: {
        anime_list: IMedia[]
    }
}

class AnimeList {
    private animeList: IMedia[]

    constructor() {
        this.animeList = []
    }

    async fetch(options: IOptions) {
        try {
            let res = await axios({
                method: "GET",
                url: `${process.env.DOMAIN}/api/anilist/anime/list`,
                headers: this.buildHeaders(options.accessToken),
            })
            const value = this.validate(res.data)
            this.animeList = value.data.anime_list
        } catch (err) {
            logger(err)
            throw err
        }
    }

    private buildHeaders(accessToken?: string): LooseObject {
        const headers: LooseObject = {}

        if (accessToken) {
            headers["anilist-access-token"] = accessToken
        }

        return headers
    }

    private validate(data: any): IAPIResponse {
        const { value, error } = resultSchema.validate(data)

        if (error) {
            throw error
        }

        return value as IAPIResponse
    }

    map(cb: (anime: IMedia) => any) {
        return this.animeList.map(cb)
    }
}

export default AnimeList
