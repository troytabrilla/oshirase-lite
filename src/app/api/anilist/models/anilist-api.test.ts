import { expect, test } from "@jest/globals"

import "../../../../../test/setup-test-env"

import { Viewer, MediaList } from "./anilist-api"
import { EMediaListStatus, EMediaType } from "@/app/shared/types/anilist"

const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN as string
const TEST_USER_ID = parseInt(process.env.TEST_USER_ID as string, 10)

describe("Auth", () => {
    test("should throw an error for an invalid auth code", async () => {
        const viewer = new Viewer("invalid")
        await expect(viewer.fetch()).rejects.toThrow()
    })
})

describe("Viewer", () => {
    test("should throw an error for an invalid access token", async () => {
        const viewer = new Viewer("invalid")
        await expect(viewer.fetch()).rejects.toThrow()
    })

    test("should fetch and serialize viewer", async () => {
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
                user_id: TEST_USER_ID,
                type: EMediaType.ANIME,
                status_in: [EMediaListStatus.CURRENT],
            })
        ).rejects.toThrow()
    })

    test("should fetch and serialize list", async () => {
        const list = new MediaList(TEST_ACCESS_TOKEN)
        await list.fetch({
            user_id: TEST_USER_ID,
            type: EMediaType.ANIME,
            status_in: [EMediaListStatus.CURRENT],
        })
        const data = list.serialize()
        expect(data?.length).toBeGreaterThan(0)
    })
})
