import { NextRequest, NextResponse } from "next/server"
import _debug from "debug"

import fetchViewer from "./lib/fetch-viewer"
import fetchList from "./lib/fetch-list"
import { IMediaListStatus, isMediaListStatus } from "./lib/call-anilist-api"

export async function GET(req: NextRequest) {
    const accessToken = req.cookies.get("anilist-access-token")

    if (!accessToken) {
        throw new Error("No AniList API access token")
    }

    const url = new URL(req.nextUrl.clone())
    const { searchParams } = url
    let status = searchParams.get("status")?.toUpperCase()
    if (!isMediaListStatus(status)) {
        status = "CURRENT"
    }

    const viewer = await fetchViewer(accessToken.value)
    const list = await fetchList(accessToken.value, viewer.id, [
        status as IMediaListStatus,
    ])

    return NextResponse.json({
        data: {
            anime_list: list,
        },
    })
}
