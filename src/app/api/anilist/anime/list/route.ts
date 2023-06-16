import { NextRequest, NextResponse } from "next/server"

import fetchViewer from "./lib/fetch-viewer"
import fetchList from "./lib/fetch-list"
import { EMediaListStatus } from "@/app/shared/types/anilist"
import errorHandler from "@/app/api/lib/error-handler"

export async function GET(req: NextRequest) {
    const accessToken = req.headers.get("anilist-access-token")
    if (!accessToken) {
        return NextResponse.json(
            { data: { message: "No AniList API access token provided" } },
            { status: 400 }
        )
    }

    try {
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
    } catch (err: unknown) {
        const { status, message } = errorHandler(err)
        return NextResponse.json(
            {
                data: {
                    message,
                },
            },
            { status }
        )
    }
}
