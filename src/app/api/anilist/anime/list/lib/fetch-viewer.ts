import _debug from "debug"

import callAniListAPI from "./call-anilist-api"
import { viewerSchema } from "../schemas/anilist"

const debug = _debug(
    "oshirase-lite/src/app/api/anilist/anime/list/lib/fetch-viewer"
)

const VIEWER_QUERY = `query ViewerQuery {
    Viewer {
        id
    }
}`

interface IViewer {
    id: number
}

export default async function fetchViewer(
    accessToken: string
): Promise<IViewer> {
    const data = await callAniListAPI(accessToken, VIEWER_QUERY)

    const { value, error } = viewerSchema.validate(data)

    if (error) {
        debug(error)
        throw new Error("Invalid viewer")
    }

    return value.data.Viewer as IViewer
}
