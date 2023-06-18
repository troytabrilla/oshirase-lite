import AnimeList from "../models/anime-list"
import AnimeTable from "./anime-table"

export default async function AnimeListPage() {
    let list = new AnimeList()

    try {
        await list.fetch()
    } catch (err) {
        throw err
    }

    return <AnimeTable list={list} />
}
