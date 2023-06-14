import { ChangeEvent, FormEvent, useState } from "react";

const AniListLoginForm = () => {
    const [authCode, setAuthCode] = useState("");

    const handleAuthCode = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();

        setAuthCode(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // TODO Emulate actual oauth flow by redirecting to GET endpoint with code in url
        // TODO Handle errors
        fetch("/api/anilist/authorize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ auth_code: authCode }),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <textarea
                id="auth_code"
                value={authCode}
                onChange={handleAuthCode}
                className="border-solid border-2 border-black rounded-sm mt-2"
            ></textarea>

            <button
                id="submit_auth"
                type="submit"
                className="border-solid border-2 border-black rounded-sm mt-2 p-2"
            >
                Authorize
            </button>
        </form>
    );
};

export default AniListLoginForm;
