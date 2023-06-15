import joi from "joi"

export const resultSchema = joi.object({
    data: joi.object({
        anime_list: joi.array().items(
            joi.object({
                media_id: joi.number().required(),
                media_type: joi.string().required(),
                format: joi.string().required(),
                season: joi.string(),
                season_year: joi.number(),
                title: joi.string().required(),
                english_title: joi.string(),
                image: joi.string(),
                episodes: joi.number(),
                status: joi.string().required(),
                score: joi.number(),
                progress: joi.number(),
            })
        ),
    }),
})
