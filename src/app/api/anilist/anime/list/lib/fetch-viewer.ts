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
    const json = await callAniListAPI(accessToken, VIEWER_QUERY)

    const { value, error } = viewerSchema.validate(json)

    if (error) {
        throw error
    }

    return value.data.Viewer as IViewer
}
