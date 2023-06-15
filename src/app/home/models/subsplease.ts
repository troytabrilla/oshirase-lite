import { IModel, IModelList } from "./base"

interface IAnimeRelease {
    title: string
    category: string
}

export class AnimeRelease implements IModel<IAnimeRelease> {
    validate(data: unknown): IAnimeRelease {
        return { title: "", category: "" }
    }
}

export class AnimeReleaseList implements IModelList<IAnimeRelease> {
    async fetch(status: string): Promise<IAnimeRelease[]> {
        return []
    }
}
