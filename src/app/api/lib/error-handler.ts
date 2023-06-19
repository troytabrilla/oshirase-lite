import { NextResponse } from "next/server"
import { AxiosError } from "axios"
import { ValidationError } from "joi"
import _debug from "debug"
import { CustomError } from "@/app/api/lib/errors"

const debug = _debug("oshirase-lite/src/app/api/lib/error-handler")

interface IResponse {
    data: {
        message: string
    }
}

const errorHandler = function (err: Error): NextResponse<IResponse> {
    debug(err)

    if (err instanceof CustomError) {
        return respond(err.status, err.message)
    }

    if (err instanceof AxiosError) {
        return axiosErrorHandler(err)
    }

    if (err instanceof ValidationError) {
        return respond(500, "Invalid response from external service")
    }

    return respond(
        500,
        "Whoops, something went wrong... Please contact support for help"
    )
}

const respond = function (
    status: number,
    message: string
): NextResponse<IResponse> {
    return NextResponse.json({ data: { message } }, { status })
}

const axiosErrorHandler = function (
    err: AxiosError<any, any>
): NextResponse<IResponse> {
    const status = err.response?.status || 500
    const errors = err.response?.data?.errors

    let message = err.message || "Could not make request to external service"
    if (errors?.length > 0) {
        debug(errors)

        if (errors[0]?.message) {
            message = errors[0].message
        }
    }

    return respond(status, message)
}

export default errorHandler
