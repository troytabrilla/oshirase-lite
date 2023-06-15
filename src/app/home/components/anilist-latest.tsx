import { cookies } from "next/headers"

import Whoops from "@/app/shared/components/whoops"

export default async function AniListLatestPage() {
    const domain = process.env.DOMAIN

    if (!domain) {
        return <Whoops />
    }

    const headers: {
        [key: string]: string
    } = {}

    const accessToken = cookies().get("anilist-access-token")
    if (accessToken) {
        headers["anilist-access-token"] = accessToken.value
    }
    const res = await fetch(`${domain}/api/anilist/anime/list`, {
        method: "GET",
        headers: headers,
    })

    const data = await res.json()

    // TODO Make schemas/types shared between client and server?
    // TODO Add simple list of current anime with latest data, ability to update progress and score
    return (
        <>
            <p className="text-2xl">Latest</p>
            {data.data.anime_list.map((anime: any) => {
                return (
                    <pre key={anime.media_id}>
                        {JSON.stringify(anime, null, 4)}
                    </pre>
                )
            })}
        </>
    )
}
