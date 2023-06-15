import { IModel, IModelList } from "./base"

interface IAnime {
    media_id: number
}

export class Anime implements IModel<IAnime> {
    validate(data: unknown): IAnime {
        return { media_id: 1 }
    }
}

export class AnimeList implements IModelList<IAnime> {
    async fetch(status: string): Promise<IAnime[]> {
        return []
    }
}
