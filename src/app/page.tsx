import AniListLogin from "./components/anilist/login/AniListLogin"

// TODO Check if user is "logged in" and redirect accordingly. Route handler?
// TODO Redirect to anilist/login first, then redirect to anilist/latest after login
const HomePage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center">
            <AniListLogin />
        </main>
    )
}

export default HomePage
