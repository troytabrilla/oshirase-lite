import { cookies } from "next/headers"
import axios from "axios"

import { resultSchema } from "../schemas/anime-list"
import { IMedia, LooseObject } from "@/app/shared/types/anilist"

interface IAPIResponse {
    data: {
        anime_list: IMedia[]
    }
}

export default class AnimeList {
    _animeList: IMedia[]

    constructor() {
        this._animeList = []
    }

    async fetch() {
        try {
            let res = await axios({
                method: "GET",
                url: `${process.env.DOMAIN}/api/anilist/anime/list`,
                headers: this.getHeaders(),
            })
            const value = this.validate(res.data)
            this._animeList = value.data.anime_list
        } catch (err) {
            throw err
        }
    }

    getHeaders(): LooseObject {
        const headers: LooseObject = {}

        const accessToken = cookies().get("anilist-access-token")
        if (accessToken) {
            headers["anilist-access-token"] = accessToken.value
        }

        return headers
    }

    validate(data: any): IAPIResponse {
        const { value, error } = resultSchema.validate(data)

        if (error) {
            throw error
        }

        return value as IAPIResponse
    }

    map(cb: (anime: IMedia) => any) {
        return this._animeList.map(cb)
    }
}
