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

export interface IAnime {
    media_id: number
    media_type: IMediaType
    format: string
    season?: string
    season_year?: number
    title: string
    english_title?: string
    image?: string
    episodes?: number
    status: IMediaListStatus
    score?: number
    progress?: number
}
