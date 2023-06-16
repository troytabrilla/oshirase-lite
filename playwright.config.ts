import { defineConfig } from "@playwright/test"

export default defineConfig({
    testMatch: "**/*.spec.ts",
    webServer: {
        command: "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        stdout: "pipe",
        stderr: "pipe",
    },
})
