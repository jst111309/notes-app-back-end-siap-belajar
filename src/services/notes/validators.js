import Joi from 'joi';
export const noteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  body: Joi.string().allow('').required(),
  tags: Joi.array().items(Joi.string().trim()).default([]),
});
