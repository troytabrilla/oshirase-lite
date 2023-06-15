import Link from "next/link"

const Header = () => {
    return (
        <header className="flex flex-row justify-center items-center gap-4 p-8">
            <Link href="/">Home</Link>
            <Link href="/anilist/login">Authorize</Link>
        </header>
    )
}

export default Header
