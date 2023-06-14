import joi from "joi"

export const requestSchema = joi.object({
    auth_code: joi.string().alphanum().length(834).required(),
})

export const responseSchema = joi.object({
    token_type: joi.string(),
    expires_in: joi.number().required(),
    access_token: joi
        .string()
        .pattern(/[a-zA-Z0-9\-_]+/)
        .length(1083)
        .required(),
    refresh_token: joi.string(),
})
