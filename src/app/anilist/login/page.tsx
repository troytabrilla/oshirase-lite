import Link from "next/link"

// TODO Add tests
const AniListLoginPage = () => {
    const clientId = process.env.ANILIST_OAUTH_CLIENT_ID
    const redirectUri = process.env.ANILIST_OAUTH_REDIRECT_URI

    if (!clientId || !redirectUri) {
        return (
            <p className="text-2xl">
                Sorry, something went wrong... Please contact support for help.
            </p>
        )
    }

    const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&response_type=code`

    return (
        <p className="text-2xl">
            Welcome to Nintei. Please{" "}
            <a href={authUrl} className="text-blue-500">
                log into your AniList account
            </a>{" "}
            to authorize this service.
        </p>
    )
}

export default AniListLoginPage
