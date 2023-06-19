export interface IMedia {
    media_id: number
    media_type: EMediaType
    format: EMediaFormat
    season?: EMediaSeason
    season_year?: number
    title: string
    english_title?: string
    image?: string
    episodes?: number
    status: EMediaListStatus
    score?: number
    progress?: number
}

export enum EMediaType {
    ANIME = "ANIME",
    MANGA = "MANGA",
}

export enum EMediaFormat {
    TV = "TV",
    TV_SHORT = "TV_SHORT",
    MOVIE = "MOVIE",
    SPECIAL = "SPECIAL",
    OVA = "OVA",
    ONA = "ONA",
    MUSIC = "MUSIC",
    MANGA = "MANGA",
    NOVEL = "NOVEL",
    ONE_SHOT = "ONE_SHOT",
}

export enum EMediaSeason {
    WINTER = "WINTER",
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL",
}

export enum EMediaListStatus {
    CURRENT = "CURRENT",
    PLANNING = "PLANNING",
    COMPLETED = "COMPLETED",
    DROPPED = "DROPPED",
    PAUSED = "PAUSED",
    REPEATING = "REPEATING",
}

export interface LooseObject {
    [key: string]: any
}

export const enumToStringArray = (e: LooseObject): string[] => {
    return Object.values(e).map((val) => e[val] as string)
}
