import { NextRequest, NextResponse } from "next/server"
import _debug from "debug"

import fetchViewer from "./lib/fetch-viewer"
import fetchList from "./lib/fetch-list"
import { EMediaListStatus } from "@/app/shared/types/anilist"

export async function GET(req: NextRequest) {
    const accessToken = req.headers.get("anilist-access-token")

    if (!accessToken) {
        throw new Error("No AniList API access token")
    }

    const url = new URL(req.nextUrl.clone())
    const { searchParams } = url
    let status = searchParams.get("status")?.toUpperCase()
    let mediaListStatus: EMediaListStatus =
        EMediaListStatus[status as keyof typeof EMediaListStatus] ||
        EMediaListStatus.CURRENT

    const viewer = await fetchViewer(accessToken)
    const list = await fetchList(accessToken, viewer.id, [mediaListStatus])

    return NextResponse.json({
        data: {
            anime_list: list,
        },
    })
}
