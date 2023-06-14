import AniListLogin from "./components/anilist/login/AniListLogin"

// TODO Checked if user is "logged in" and redirect accordingly. Route handler?
const HomePage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center">
            <AniListLogin/ >
        </main>
    )
}

export default HomePage
