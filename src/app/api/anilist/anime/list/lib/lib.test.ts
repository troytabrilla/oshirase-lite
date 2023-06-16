import { expect, test } from "@jest/globals"
import dotenv from "dotenv"
import path from "path"

import callAniListAPI from "./call-anilist-api"
import fetchList from "./fetch-list"
import fetchViewer from "./fetch-viewer"

dotenv.config({ path: path.resolve(process.cwd(), ".env.test.local") })

const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN as string
const TEST_USER_ID = parseInt(process.env.TEST_USER_ID as string, 10)

describe("callAniListAPI", () => {
    test("should throw an error for an invalid access token", async () => {
        await expect(callAniListAPI("invalid", "query")).rejects.toThrow()
    })

    test("should throw an error for an invalid query", async () => {
        await expect(
            callAniListAPI(TEST_ACCESS_TOKEN, "query")
        ).rejects.toThrow()
    })

    test("should return an object for a valid access token and query", async () => {
        const query = `query UserQuery {
            User(id: ${TEST_USER_ID}) {
                id
                name
            }
        }`
        const data: any = await callAniListAPI(TEST_ACCESS_TOKEN, query)
        expect(data.data.User.id).toEqual(TEST_USER_ID)
    })
})

describe("fetchList", () => {
    test("should return an anime list for a valid user", async () => {
        const data = await fetchList(TEST_ACCESS_TOKEN, TEST_USER_ID)
        expect(data.length).toBeGreaterThan(0)
    })

    test("should throw an error for an invalid user", async () => {
        await expect(fetchList(TEST_ACCESS_TOKEN, 0)).rejects.toThrow()
    })
})

describe("fetchViewer", () => {
    test("should return a viewer ID for a valid access token", async () => {
        const data = await fetchViewer(TEST_ACCESS_TOKEN)
        expect(data.id).toEqual(TEST_USER_ID)
    })
})
