import { expect, test } from "@jest/globals"
import { AxiosError } from "axios"
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
        await expect(callAniListAPI("invalid", "query")).rejects.toThrow(
            AxiosError
        )
    })

    test("should throw an error for an invalid query", async () => {
        await expect(
            callAniListAPI(TEST_ACCESS_TOKEN, "query")
        ).rejects.toThrow(AxiosError)
    })

    test("should return an object for a valid access token and query", async () => {
        const query = `query UserQuery {
            User(id: ${TEST_USER_ID}) {
                id
                name
            }
        }`
        const json: any = await callAniListAPI(TEST_ACCESS_TOKEN, query)
        expect(json.data.User.id).toEqual(TEST_USER_ID)
    })
})

describe("fetchList", () => {
    test("should return an anime list for a valid user", async () => {
        const json = await fetchList(TEST_ACCESS_TOKEN, TEST_USER_ID)
        expect(json.length).toBeGreaterThan(0)
    })

    test("should throw an error for an invalid user", async () => {
        await expect(fetchList(TEST_ACCESS_TOKEN, 0)).rejects.toThrow()
    })
})

describe("fetchViewer", () => {
    test("should return a viewer ID for a valid access token", async () => {
        const json = await fetchViewer(TEST_ACCESS_TOKEN)
        expect(json.id).toEqual(TEST_USER_ID)
    })
})
