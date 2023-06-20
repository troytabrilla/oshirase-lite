import axios from "axios"
import debug from "debug"

const logger = debug("oshirase-lite/src/app/home/models/anime-list")

import { resultSchema } from "../schemas/anime-list"
import { IMedia } from "@/app/shared/types/anilist"

interface IMediaList {
    fetch(options: IOptions): Promise<void>
    map<T>(cb: (media: IMedia) => T): T[]
}

interface IOptions extends Record<string, string | undefined> {
    accessToken?: string
}

interface IAPIResponse {
    data: {
        anime_list: IMedia[]
    }
}

class AnimeList implements IMediaList {
    private animeList: IMedia[]

    constructor() {
        this.animeList = []
    }

    async fetch(options: IOptions): Promise<void> {
        try {
            if (!options.accessToken) {
                throw new Error("No access token provided")
            }

            let res = await axios({
                method: "GET",
                url: `${process.env.DOMAIN}/api/anilist/anime/list`,
                headers: {
                    "anilist-access-token": options.accessToken,
                },
            })
            const value = this.validate(res.data)
            this.animeList = value.data.anime_list
        } catch (err) {
            logger(err)
            throw err
        }
    }

    private validate(data: any): IAPIResponse {
        const { value, error } = resultSchema.validate(data)

        if (error) {
            logger(error)
            throw error
        }

        return value as IAPIResponse
    }

    map<T>(cb: (media: IMedia) => T): T[] {
        return this.animeList.map(cb)
    }
}

export default AnimeList
