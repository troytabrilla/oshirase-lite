import { IMedia } from "@/app/shared/types/anilist"
import Image from "next/image"

const AnimeTableEntry = ({ anime }: { anime: IMedia }) => {
    return (
        <tr key={anime.media_id} className="anime-table-entry">
            <td className="anime-table-entry-image border border-slate-700">
                {anime.image ? (
                    <Image
                        src={anime.image}
                        alt={anime.title}
                        height={326}
                        width={230}
                        className="h-32 w-auto"
                    />
                ) : (
                    <span />
                )}
            </td>
            <td className="anime-table-entry-title border border-slate-700">
                <a
                    href={`https://anilist.co/anime/${anime.media_id}`}
                    target="_blank"
                    className="text-blue-500"
                >
                    {anime.title}
                </a>
            </td>
            <td className="anime-table-entry-progress border border-slate-700">
                {anime.progress} / {anime.episodes}
            </td>
            <td className="anime-table-entry-score border border-slate-700">
                {anime.score}
            </td>
            <td className="anime-table-entry-season border border-slate-700">
                {anime.season} {anime.season_year}
            </td>
        </tr>
    )
}

export default AnimeTableEntry
