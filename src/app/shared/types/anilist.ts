export enum EMediaType {
    ANIME = "ANIME",
    MANGA = "MANGA",
}

export enum EMediaListStatus {
    CURRENT = "CURRENT",
    PLANNING = "PLANNING",
    COMPLETED = "COMPLETED",
    DROPPED = "DROPPED",
    PAUSED = "PAUSED",
    REPEATING = "REPEATING",
}

export interface IAnime {
    media_id: number
    media_type: EMediaType
    format: string
    season?: string
    season_year?: number
    title: string
    english_title?: string
    image?: string
    episodes?: number
    status: EMediaListStatus
    score?: number
    progress?: number
}
