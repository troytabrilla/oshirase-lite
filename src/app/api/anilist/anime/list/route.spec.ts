import { test, expect } from "@playwright/test"

import "../../../../../../test/setup-test-env"

const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN as string

test("should return 400 without access token", async ({ request }) => {
    const res = await request.get(
        "http://localhost:3000/api/anilist/anime/list"
    )
    expect(res.status()).toEqual(400)

    const json = await res.json()
    expect(json.data.message).toEqual("No AniList API access token provided")
})

test("should return 400 for invalid access token", async ({ request }) => {
    const res = await request.get(
        "http://localhost:3000/api/anilist/anime/list",
        {
            headers: {
                "anilist-access-token": "invalid",
            },
        }
    )
    expect(res.status()).toEqual(400)

    const json = await res.json()
    expect(json.data.message).toEqual("Request failed with status code 400")
})

test("should return 200 for valid access token", async ({ request }) => {
    const res = await request.get(
        "http://localhost:3000/api/anilist/anime/list",
        {
            headers: {
                "anilist-access-token": TEST_ACCESS_TOKEN,
            },
        }
    )
    expect(res.status()).toEqual(200)

    const json = await res.json()
    expect(json.data.anime_list.length).toBeGreaterThan(0)
})
