import Joi from 'joi';
import httpStatusCode from '../utils/constants.util.js';

const createMessage = async (req, res, next) => {
  const data = { ...req.body, sender: req.userId.toString() };

  const condition = Joi.object({
    sender: Joi.string().required(),
    receivers: Joi.array().items(Joi.string().required()).required(),
    content: Joi.string().required(),
  });

  try {
    await condition.validateAsync(data, { abortEarly: false });
    req.data = data;
    next();
  } catch (error) {
    res.status(httpStatusCode.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

const messageValidation = { createMessage };

export default messageValidation;
