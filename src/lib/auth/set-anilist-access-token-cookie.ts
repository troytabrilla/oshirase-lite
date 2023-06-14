import { cookies } from "next/headers"
import { add } from "date-fns"

export default function setAccessTokenCookie(
    accessToken: string,
    expiresIn: number
) {
    cookies().set({
        name: "anilist-access-token",
        value: accessToken,
        httpOnly: true,
        sameSite: "strict",
        expires: add(new Date(), { seconds: expiresIn }),
        path: "/",
    })
}
