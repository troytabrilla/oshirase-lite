import { IAnime } from "@/app/shared/types/anilist"
import AnimeTableEntry from "./anime-table-entry"
import AnimeList from "../models/anime-list"

const AnimeTable = ({ list }: { list: AnimeList }) => {
    return (
        <table className="border-separate border-spacing-1 border border-slate-500 text-center">
            <thead>
                <tr>
                    <th className="border border-slate-600"></th>
                    <th className="border border-slate-600">Title</th>
                    <th className="border border-slate-600">Progress</th>
                    <th className="border border-slate-600">Score</th>
                    <th className="border border-slate-600">Season</th>
                </tr>
            </thead>
            <tbody>
                {list.map((anime: IAnime) => {
                    return (
                        <AnimeTableEntry key={anime.media_id} anime={anime} />
                    )
                })}
            </tbody>
        </table>
    )
}

export default AnimeTable
