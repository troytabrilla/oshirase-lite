const AniListLoginPage = () => {
    const clientId = process.env.ANILIST_OAUTH_CLIENT_ID
    const redirectUri = process.env.ANILIST_OAUTH_REDIRECT_URI

    if (!clientId || !redirectUri) {
        throw new Error("Could not set up AniList API auth call")
    }

    const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&response_type=code`

    return (
        <p className="text-2xl">
            Welcome to Oshirase-lite. Please{" "}
            <a href={authUrl} className="login text-blue-500">
                log into your AniList account
            </a>{" "}
            to authorize this service.
        </p>
    )
}

export default AniListLoginPage
