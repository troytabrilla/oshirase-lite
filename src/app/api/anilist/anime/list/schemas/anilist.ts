import joi from "joi"

export const viewerSchema = joi.object({
    data: joi
        .object({
            Viewer: joi
                .object({
                    id: joi.number().required(),
                })
                .required(),
        })
        .required(),
})
