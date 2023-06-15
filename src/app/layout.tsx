import "./globals.css"
import { Inter } from "next/font/google"

import Header from "./home/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Nintei",
    description: "An authorization microservice",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                <main className="flex flex-col items-center min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    )
}
