import { expect, test } from "@jest/globals"
import dotenv from "dotenv"
import path from "path"

import callAniListAPI from "./call-anilist-api"
import fetchList from "./fetch-list"
import fetchViewer from "./fetch-viewer"

dotenv.config({ path: path.resolve(process.cwd(), ".env.test.local") })

describe("callAniListAPI", () => {})

describe("fetchList", () => {})

describe("fetchViewer", () => {
    test("should throw an error for invalid access token", async () => {
        await expect(fetchViewer("invalid")).rejects.toThrow()
    })

    test("should return a viewer ID for a valid access token", async () => {
        const data = await fetchViewer(process.env.TEST_ACCESS_TOKEN as string)
        expect(data.id).toBeGreaterThan(0)
    })
})
