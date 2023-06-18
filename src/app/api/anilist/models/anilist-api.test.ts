import { expect, test } from "@jest/globals"

import "../../../../../test/setup-test-env"

import { Viewer, MediaList } from "./anilist-api"
import { EMediaType } from "@/app/shared/types/anilist"

const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN as string
const TEST_USER_ID = parseInt(process.env.TEST_USER_ID as string, 10)

describe("Viewer", () => {
    test("should throw an error for an invalid access token", async () => {
        const viewer = new Viewer("invalid")
        await expect(viewer.fetch()).rejects.toThrow()
    })

    test("should fetch viewer for a valid access token", async () => {
        const viewer = new Viewer(TEST_ACCESS_TOKEN)
        await viewer.fetch()
        expect(viewer.data).toEqual({
            Viewer: {
                id: TEST_USER_ID,
            },
        })
    })

    test("should serialize viewer", async () => {
        const viewer = new Viewer(TEST_ACCESS_TOKEN)
        await viewer.fetch()
        const data = viewer.serialize()
        expect(data).toEqual({
            id: TEST_USER_ID,
        })
    })
})

describe("MediaList", () => {
    test("should throw an error for an invalid access token", async () => {
        const list = new MediaList("invalid")
        await expect(
            list.fetch({
                userId: TEST_USER_ID,
                mediaType: EMediaType.ANIME,
            })
        ).rejects.toThrow()
    })

    test("should fetch list for a valid access token", async () => {
        const list = new MediaList(TEST_ACCESS_TOKEN)
        await list.fetch({
            userId: TEST_USER_ID,
            mediaType: EMediaType.ANIME,
        })
        expect(list.data.MediaListCollection.lists.length).toBeGreaterThan(0)
    })

    test("should serialize list", async () => {
        const list = new MediaList(TEST_ACCESS_TOKEN)
        await list.fetch({
            userId: TEST_USER_ID,
            mediaType: EMediaType.ANIME,
        })
        const data = list.serialize()
        expect(data?.length).toBeGreaterThan(0)
    })
})
