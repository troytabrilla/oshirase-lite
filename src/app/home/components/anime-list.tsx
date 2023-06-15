import _debug from "debug"

import Whoops from "@/app/shared/components/whoops"
import * as AniListAPI from "../models/anilist"
import AnimeTable from "./anime-table"

const debug = _debug("nintei/src/app/home/components/anime-list")

export default async function AnimeListPage() {
    let list

    try {
        list = await AniListAPI.fetchAnimeList()
    } catch (err) {
        debug(err)
        return <Whoops />
    }

    return (
        <>
            <p className="text-2xl mb-4">Current Season</p>
            <AnimeTable list={list} />
        </>
    )
}
