import Link from "next/link"

// TODO Check if user is "logged in" and redirect accordingly. Route handler?
// TODO Redirect to anilist/login first, then redirect to anilist/latest after login
const HomePage = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI

    if (!clientId || !redirectUri) {
        return (
            <p>
                Sorry, something went wrong... Please contact support for help.
            </p>
        )
    }

    const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&response_type=code`

    return (
        <main className="flex min-h-screen flex-col items-center">
            <p className="text-2xl">
                Welcome to Nintei. Please{" "}
                <Link href={authUrl} className="text-blue-500">
                    log into your AniList account
                </Link>{" "}
                to authorize this service.
            </p>
        </main>
    )
}

export default HomePage
