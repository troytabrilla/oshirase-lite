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

export default function errorHandler(err: Error): NextResponse<IResponse> {
    debug(err)

    if (err instanceof CustomError) {
        return NextResponse.json(
            { data: { message: err.message } },
            { status: err.status }
        )
    }

    if (err instanceof AxiosError) {
        const status = err.response?.status || 500
        const errors = err.response?.data?.errors

        let message =
            err.message || "Could not make request to external service"
        if (errors?.length > 0) {
            debug(errors)

            if (errors[0]?.message) {
                message = errors[0].message
            }
        }

        if (status && message) {
            return NextResponse.json({ data: { message } }, { status })
        }
    }

    if (err instanceof ValidationError) {
        return NextResponse.json(
            {
                data: {
                    message: "Invalid response from external service",
                },
            },
            { status: 500 }
        )
    }

    return NextResponse.json(
        {
            data: {
                message:
                    "Whoops, something went wrong... Please contact support for help",
            },
        },
        { status: 500 }
    )
}
