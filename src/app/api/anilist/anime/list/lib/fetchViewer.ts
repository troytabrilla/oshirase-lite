import _debug from "debug"

import { viewerSchema } from "../schemas/anilist"

const debug = _debug("nintei/src/app/api/anilist/anime/list/lib/fetchViewer")

interface IViewer {
    id: number
}

const viewerQuery = `query ViewerQuery {
    Viewer {
        id
    }
}`

export default async function fetchViewer(
    accessToken: string
): Promise<IViewer> {
    const url = process.env.ANILIST_GRAPHQL_API_URI

    if (!url) {
        throw new Error("Could not find AniList GraphQL API endpoint")
    }

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: viewerQuery,
        }),
    })

    if (res.status != 200) {
        debug(
            {
                status: res.status,
                statusText: res.statusText,
                json: await res.json(),
            },
            "fetchViewer"
        )

        throw new Error("Could not fetch viewer")
    }

    const data = await res.json()

    const { value, error } = viewerSchema.validate(data)

    if (error) {
        debug({ error }, "fetchViewer")
        throw new Error("Invalid viewer")
    }

    return value.data.Viewer as IViewer
}
