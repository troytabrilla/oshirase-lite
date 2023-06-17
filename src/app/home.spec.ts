import { test, expect } from "@playwright/test"

import "../../test/setup-test-env"

test("should redirect to the AniList login page without access token cookie", async ({
    page,
}) => {
    await page.goto("http://localhost:3000/")
    await expect(page).toHaveURL("http://localhost:3000/anilist/login")
    await expect(page.locator(".text-2xl")).toContainText(
        "Welcome to Oshirase-lite. Please log into your AniList account to authorize this service."
    )
})

test("should show anime list table with access token cookie", async ({
    browser,
}) => {
    const context = await browser.newContext()
    context.addCookies([
        {
            name: "anilist-access-token",
            value: process.env.TEST_ACCESS_TOKEN as string,
            domain: "localhost:3000",
            path: "/",
            httpOnly: true,
            sameSite: "Lax",
        },
    ])
    const page = await context.newPage()

    await page.goto("http://localhost:3000/")
    await expect(page).toHaveURL("http://localhost:3000/")
    await expect(page.locator("table")).toBeVisible()
})
