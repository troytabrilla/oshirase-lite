import Whoops from "@/app/shared/components/whoops"

const AniListLoginPage = () => {
    const clientId = process.env.ANILIST_OAUTH_CLIENT_ID
    const redirectUri = process.env.ANILIST_OAUTH_REDIRECT_URI

    if (!clientId || !redirectUri) {
        return <Whoops />
    }

    const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&response_type=code`

    return (
        <p className="text-2xl">
            Welcome to Oshirase-lite. Please{" "}
            <a href={authUrl} className="text-blue-500">
                log into your AniList account
            </a>{" "}
            to authorize this service.
        </p>
    )
}

export default AniListLoginPage
