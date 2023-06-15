import _debug from "debug"

const debug = _debug(
    "nintei/src/app/api/anilist/anime/list/lib/call-anilist-api"
)

export type IMediaType = "ANIME" | "MANGA"
export type IMediaListStatus =
    | "CURRENT"
    | "PLANNING"
    | "COMPLETED"
    | "DROPPED"
    | "PAUSED"
    | "REPEATING"

export function isMediaListStatus(status?: string): status is IMediaListStatus {
    if (!status) {
        return false
    }

    return [
        "CURRENT",
        "PLANNING",
        "COMPLETED",
        "DROPPED",
        "PAUSED",
        "REPEATING",
    ].includes(status)
}

interface IListQueryVariables {
    user_id: number
    type: IMediaType
    status_in: IMediaListStatus[]
}

export default async function callAniListAPI(
    accessToken: string,
    query: string,
    variables?: IListQueryVariables
): Promise<unknown> {
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
            query,
            variables,
        }),
    })

    if (res.status != 200) {
        debug(
            {
                status: res.status,
                statusText: res.statusText,
                json: await res.json(),
            },
            "callAniListAPI"
        )

        throw new Error("Could not call AniList API")
    }

    return await res.json()
}