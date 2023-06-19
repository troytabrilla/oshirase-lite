import AnimeList from "../models/anime-list"
import AnimeTable from "./anime-table"

const AnimeListPage = async function () {
    let list = new AnimeList()

    try {
        await list.fetch()
    } catch (err) {
        throw err
    }

    return <AnimeTable list={list} />
}

export default AnimeListPage
