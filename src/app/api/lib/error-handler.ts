import { AxiosError } from "axios"
import { ValidationError } from "joi"
import _debug from "debug"
import { CustomError } from "@/app/api/lib/errors"

const debug = _debug("oshirase-lite/src/app/api/lib/error-handler")

export default function errorHandler(err: Error): {
    status: number
    message: string
} {
    debug(err)

    if (err instanceof CustomError) {
        return { status: err.status, message: err.message }
    }

    if (err instanceof AxiosError) {
        const status = err.response?.status
        const message = err.message

        if (status && message) {
            return { status, message }
        }
    }

    if (err instanceof ValidationError) {
        return { status: 500, message: "Invalid response from external API." }
    }

    return {
        status: 500,
        message:
            "Whoops, something went wrong... Please contact support for help.",
    }
}
