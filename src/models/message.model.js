import Joi from 'joi';

const messageModel = Joi.object({
  sender: Joi.string().required(),
  receivers: Joi.array().items(Joi.string().required()).required(),
  content: Joi.string().required(),
  reaction: Joi.any().default(null),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

export default messageModel;
