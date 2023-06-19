import { NextRequest, NextResponse } from "next/server"

export const middleware = (req: NextRequest) => {
    const authorized = !!req.cookies.get("anilist-access-token")
    const url = req.nextUrl.clone()

    if (!authorized && url.pathname !== "/anilist/login") {
        const url = req.nextUrl.clone()
        url.pathname = "/anilist/login"
        return NextResponse.redirect(url)
    }

    if (authorized && url.pathname === "/anilist/login") {
        const url = req.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
    }

    NextResponse.next()
}

export const config = {
    matcher: ["/", "/anilist/login"],
}
