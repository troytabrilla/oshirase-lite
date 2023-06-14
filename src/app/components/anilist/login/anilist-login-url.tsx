interface AniListLoginUrlProps {
    clientId: string,
    redirectUri: string
}

const AniListLoginUrl = (props: AniListLoginUrlProps) => {
    const { clientId, redirectUri } = props;
    const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`

    return (
        <a href={authUrl} target="_blank" className="text-blue-500">
            Login with AniList and Paste the Authorization Text Below
        </a>
    )
}

export default AniListLoginUrl
