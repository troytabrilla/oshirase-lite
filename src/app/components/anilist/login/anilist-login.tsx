"use client";

import AniListLoginUrl from "./anilist-login-url";
import AniListLoginForm from "./anilist-login-form";

const AniListLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return (
            <p>
                Sorry, something went wrong... Please contact support for help.
            </p>
        );
    }

    return (
        <>
            <AniListLoginUrl clientId={clientId} redirectUri={redirectUri} />
            <AniListLoginForm />
        </>
    );
};

export default AniListLogin;
