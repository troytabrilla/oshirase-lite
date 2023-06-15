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

// TODO Harden schema
const mediaSchema = joi.object({
    id: joi.number().required(),
    type: joi.string().required(),
    format: joi.string().required(),
    season: joi.string(),
    seasonYear: joi.number(),
    title: joi
        .object({
            romaji: joi.string().required(),
            english: joi.string(),
        })
        .required(),
    coverImage: joi.object({
        large: joi.string(),
    }),
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
