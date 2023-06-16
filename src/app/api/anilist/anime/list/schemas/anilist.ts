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

const titleSchema = joi.object({
    romaji: joi.string().required(),
    english: joi.string(),
})

const coverImageSchema = joi.object({
    large: joi.string(),
})

const mediaSchema = joi.object({
    id: joi.number().required(),
    type: joi.string().required(),
    format: joi.string().required(),
    season: joi.string(),
    seasonYear: joi.number(),
    title: titleSchema.required(),
    coverImage: coverImageSchema,
    episodes: joi.number(),
})

const entrySchema = joi.object({
    media: mediaSchema.required(),
    status: joi.string().required(),
    score: joi.number(),
    progress: joi.number(),
})

const statusSchema = joi.object({
    entries: joi.array().items(entrySchema).required(),
})

const mediaListCollectionSchema = joi.object({
    lists: joi.array().items(statusSchema).required(),
})

export const listSchema = joi.object({
    data: joi.object({
        MediaListCollection: mediaListCollectionSchema.required(),
    }),
})
