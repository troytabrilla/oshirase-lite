import { expect, test } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import "../../../../test/setup-test-env"

import AnimeTable from "./anime-table"

describe("AnimeTable", () => {
    test("renders a table", () => {
        const animeList = [
            {
                media_id: 1,
                media_type: "ANIME",
                format: "TV",
                season: "SPRING",
                season_year: 2023,
                title: "Title",
                english_title: "English Title",
                image: "https://www.google.com",
                episodes: 12,
                status: "CURRENT",
                score: 7,
                progress: 11,
            },
        ]
        const list = {
            map(cb: (anime: any) => any) {
                return animeList.map(cb)
            },
        }
        render(<AnimeTable list={list as any} />)

        const table = screen.getAllByRole("table")
        const rows = screen.getAllByRole("row")
        const cells = screen.getAllByRole("cell")

        expect(table).toHaveLength(1)
        expect(rows).toHaveLength(2)
        expect(cells).toHaveLength(5)
    })
})
