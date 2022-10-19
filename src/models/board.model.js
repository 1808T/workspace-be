import Joi from 'joi';

const boardModel = Joi.object({
  title: Joi.string().min(3).max(32).trim().required(),
  owner: Joi.string().required(),
  listsOrder: Joi.array().items(Joi.string()).default([]),
  members: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  status: Joi.string().default('public'),
  _destroy: Joi.boolean().default(false),
});

export default boardModel;
