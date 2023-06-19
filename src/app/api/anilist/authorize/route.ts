import { NextRequest, NextResponse } from "next/server"
import { add } from "date-fns"

import getAccessToken from "./lib/get-access-token"
import setupRedirect from "./lib/setup-redirect"
import errorHandler from "../../lib/error-handler"

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { searchParams } = new URL(req.url)

        const { access_token, expires_in } = await getAccessToken({
            auth_code: searchParams.get("code"),
        })

        const { url, sameSite } = setupRedirect(req)

        const res = NextResponse.redirect(url)

        res.cookies.set({
            name: "anilist-access-token",
            value: access_token,
            httpOnly: true,
            sameSite: sameSite,
            expires: add(new Date(), { seconds: expires_in }),
            path: "/",
        })

        return res
    } catch (err: any) {
        return errorHandler(err)
    }
}
