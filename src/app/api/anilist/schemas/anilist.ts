import joi from "joi"

import {
    EMediaType,
    EMediaFormat,
    EMediaSeason,
    EMediaListStatus,
    enumToStringArray,
} from "../../../shared/types/anilist"

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
    type: joi
        .string()
        .valid(...enumToStringArray(EMediaType))
        .required(),
    format: joi
        .string()
        .valid(...enumToStringArray(EMediaFormat))
        .required(),
    season: joi.string().valid(...enumToStringArray(EMediaSeason)),
    seasonYear: joi.number(),
    title: titleSchema.required(),
    coverImage: coverImageSchema,
    episodes: joi.number(),
})

const entrySchema = joi.object({
    media: mediaSchema.required(),
    status: joi
        .string()
        .valid(...enumToStringArray(EMediaListStatus))
        .required(),
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
