import Joi from 'joi';

const boardSchema = Joi.object({
  title: Joi.string().min(3).max(32).required(),
  listOrder: Joi.array().items(Joi.string()).default([]),
  members: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updateAt: Joi.date().timestamp().default(null),
  status: Joi.string().default('public'),
});

export default boardSchema;
