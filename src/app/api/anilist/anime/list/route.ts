import { NextRequest, NextResponse } from "next/server"

import {
    Viewer,
    MediaList,
    IListQueryVariables,
} from "../../models/anilist-api"
import { EMediaListStatus, EMediaType } from "@/app/shared/types/anilist"
import { BadRequest } from "@/app/api/lib/errors"
import errorHandler from "@/app/api/lib/error-handler"

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const accessToken = req.headers.get("anilist-access-token")
        if (!accessToken) {
            throw new BadRequest("No AniList API access token provided")
        }

        const options = await getOptions(req, accessToken)

        const list = new MediaList(accessToken)
        await list.fetch(options)

        return NextResponse.json({
            data: {
                anime_list: list.serialize(),
            },
        })
    } catch (err: any) {
        return errorHandler(err)
    }
}

const getOptions = async (
    req: NextRequest,
    accessToken: string
): Promise<IListQueryVariables> => {
    const userId = await getUserId(accessToken)
    const mediaType = EMediaType.ANIME
    const statusIn = getStatusIn(req)

    return {
        user_id: userId,
        type: mediaType,
        status_in: statusIn,
    }
}

const getUserId = async (accessToken: string): Promise<number> => {
    const viewer = new Viewer(accessToken)
    await viewer.fetch()

    const viewerId = viewer.serialize()?.id
    if (!viewerId) {
        throw new Error("No viewer ID")
    }

    return viewerId
}

const getStatusIn = (req: NextRequest): EMediaListStatus[] => {
    const url = new URL(req.nextUrl.clone())
    const { searchParams } = url
    let status = searchParams.get("status")?.toUpperCase()
    let mediaListStatus: EMediaListStatus =
        EMediaListStatus[status as keyof typeof EMediaListStatus] ??
        EMediaListStatus.CURRENT

    return [mediaListStatus]
}
