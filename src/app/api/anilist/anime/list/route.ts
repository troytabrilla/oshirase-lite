import { NextRequest, NextResponse } from "next/server"

import {
    Viewer,
    MediaList,
    IListQueryVariables,
} from "../../models/anilist-api"
import { EMediaListStatus, EMediaType } from "@/app/shared/types/anilist"
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
        const variables = await getQueryVariables(req, accessToken)

        const list = new MediaList(accessToken)
        await list.fetch(variables)

        return NextResponse.json({
            data: {
                anime_list: list.serialize(),
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

async function getQueryVariables(
    req: NextRequest,
    accessToken: string
): Promise<IListQueryVariables> {
    const userId = await getUserId(accessToken)
    const mediaType = EMediaType.ANIME
    const statusIn = getStatusIn(req)

    return {
        userId,
        mediaType,
        statusIn,
    }
}

async function getUserId(accessToken: string): Promise<number> {
    const viewer = new Viewer(accessToken)
    await viewer.fetch()

    const viewerId = viewer.serialize()?.id
    if (!viewerId) {
        throw new Error("No viewer ID")
    }

    return viewerId
}

function getStatusIn(req: NextRequest): EMediaListStatus[] {
    const url = new URL(req.nextUrl.clone())
    const { searchParams } = url
    let status = searchParams.get("status")?.toUpperCase()
    let mediaListStatus: EMediaListStatus =
        EMediaListStatus[status as keyof typeof EMediaListStatus] ||
        EMediaListStatus.CURRENT

    return [mediaListStatus]
}
