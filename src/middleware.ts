import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
    const authorized = !!request.cookies.get("anilist-access-token")
    const url = request.nextUrl.clone()

    if (!authorized && url.pathname !== "/anilist/login") {
        const url = request.nextUrl.clone()
        url.pathname = "/anilist/login"
        return NextResponse.redirect(url)
    }

    if (authorized && url.pathname === "/anilist/login") {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
    }

    NextResponse.next()
}

export const config = {
    matcher: ["/", "/anilist/login"],
}
