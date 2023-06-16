import _debug from "debug"

import Whoops from "@/app/shared/components/whoops"
import AnimeList from "../models/anime-list"
import AnimeTable from "./anime-table"

const debug = _debug("oshirase-lite/src/app/home/components/anime-list")

export default async function AnimeListPage() {
    let list = new AnimeList()

    try {
        await list.fetch()
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
