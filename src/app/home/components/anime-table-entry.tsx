import { IAnime } from "@/app/shared/types/anilist"

const AnimeTableEntry = ({ anime }: { anime: IAnime }) => {
    return (
        <tr key={anime.media_id}>
            <td className="border border-slate-700">
                <img src={anime.image} alt={anime.title} className="h-32" />
            </td>
            <td className="border border-slate-700">
                <a
                    href={`https://anilist.co/anime/${anime.media_id}`}
                    target="_blank"
                    className="text-blue-500"
                >
                    {anime.title}
                </a>
            </td>
            <td className="border border-slate-700">
                {anime.progress} / {anime.episodes}
            </td>
            <td className="border border-slate-700">{anime.score}</td>
            <td className="border border-slate-700">
                {anime.season} {anime.season_year}
            </td>
        </tr>
    )
}

export default AnimeTableEntry
