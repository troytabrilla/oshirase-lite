import joi from "joi"

import {
    EMediaType,
    EMediaFormat,
    EMediaSeason,
    EMediaListStatus,
    enumToStringArray,
} from "../../shared/types/anilist"

export const resultSchema = joi.object({
    data: joi.object({
        anime_list: joi.array().items(
            joi.object({
                media_id: joi.number().required(),
                media_type: joi
                    .string()
                    .valid(...enumToStringArray(EMediaType))
                    .required(),
                format: joi
                    .string()
                    .valid(...enumToStringArray(EMediaFormat))
                    .required(),
                season: joi.string().valid(...enumToStringArray(EMediaSeason)),
                season_year: joi.number(),
                title: joi.string().required(),
                english_title: joi.string(),
                image: joi.string(),
                episodes: joi.number(),
                status: joi
                    .string()
                    .valid(...enumToStringArray(EMediaListStatus))
                    .required(),
                score: joi.number(),
                progress: joi.number(),
            })
        ),
    }),
})
