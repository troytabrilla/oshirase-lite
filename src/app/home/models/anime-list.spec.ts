import { test, expect } from "@playwright/test"

import "../../../../test/setup-test-env"

import AnimeList from "./anime-list"
import { IMedia } from "@/app/shared/types/anilist"

test("should fetch throw an error with a missing access token", async () => {
    const list = new AnimeList()

    await expect(list.fetch({})).rejects.toThrow()
})

test("should fetch throw an error with an invalid access token", async () => {
    const list = new AnimeList()

    await expect(list.fetch({ accessToken: "invalid" })).rejects.toThrow()
})

test("should fetch a list of anime with a valid access token", async () => {
    const list = new AnimeList()

    await list.fetch({ accessToken: process.env.TEST_ACCESS_TOKEN })

    const raw: IMedia[] = list.map((anime) => anime)

    expect(raw.length).toBeGreaterThan(0)
    expect(raw[0].media_id).toBeGreaterThan(0)
})

test("should map the anime list", async () => {
    const list = new AnimeList()

    await list.fetch({ accessToken: process.env.TEST_ACCESS_TOKEN })

    const transformed: number[] = list.map((anime) => anime.media_id)

    expect(transformed.length).toBeGreaterThan(0)
    expect(transformed[0]).toBeGreaterThan(0)
})
