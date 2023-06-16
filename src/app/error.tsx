"use client"

import { useEffect } from "react"
import _debug from "debug"

const debug = _debug("oshirase-lite/src/app/error")

export default function Error({ error }: { error: Error }) {
    useEffect(() => {
        debug(error)
    }, [error])

    return (
        <p className="text-2xl">
            Whoops, something went wrong... Please contact support for help.
        </p>
    )
}
