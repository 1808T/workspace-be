import Joi from 'joi';

const commentModel = Joi.object({
  content: Joi.string().trim().required(),
  author: Joi.string().required(),
  card: Joi.string().required(),
  parentId: Joi.string().default(null),
  likes: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

export default commentModel;
