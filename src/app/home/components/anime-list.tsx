import { cookies } from "next/headers"

import AnimeList from "../models/anime-list"
import AnimeTable from "./anime-table"

const AnimeListPage = async () => {
    let list = new AnimeList()

    try {
        await list.fetch({
            accessToken: cookies().get("anilist-access-token")?.value,
        })
    } catch (err) {
        throw err
    }

    return <AnimeTable list={list} />
}

export default AnimeListPage
