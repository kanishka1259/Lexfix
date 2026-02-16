import Joi from "joi";

export const recordPerformanceSchema = Joi.object({
    lessonId: Joi.string().required(),
    moduleName: Joi.string().required(),
    difficulty: Joi.string().valid("easy", "medium", "hard").default("medium"),
    score: Joi.number().min(0).required(),
    totalQuestions: Joi.number().min(1).required(),
    timeTakenSeconds: Joi.number().min(0).optional()
});
