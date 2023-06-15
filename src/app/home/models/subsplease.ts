interface IAnimeRelease {
    title: string
    category: string
}

export async function fetchAnimeReleaseList(): Promise<IAnimeRelease[]> {
    return []
}
