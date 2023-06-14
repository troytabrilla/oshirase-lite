'use client'

import AniListLoginUrl from "./AniListLoginUrl"
import AniListLoginForm from "./AniListLoginForm"

const AniListLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI

    if (!clientId || !redirectUri) {
        return (
            <p>Sorry, something went wrong... Please contact the website admin for help.</p>
        )
    }

    return (
        <>
            <AniListLoginUrl clientId={clientId} redirectUri={redirectUri} />
            <AniListLoginForm />
        </>
    )
}

export default AniListLogin
