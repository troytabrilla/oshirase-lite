"use client"

import { useEffect } from "react"
import _debug from "debug"

const debug = _debug("oshirase-lite/src/app/error")

const Error = ({ error }: { error: Error }): React.ReactNode => {
    useEffect(() => {
        debug(error)
    }, [error])

    return (
        <p className="text-2xl">
            Whoops, something went wrong... Please contact support for help.
        </p>
    )
}

export default Error
