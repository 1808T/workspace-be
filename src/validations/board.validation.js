import Joi from 'joi';
import httpStatusCode from '../utils/constants.util.js';

const createBoard = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().min(3).max(32).required(),
    status: Joi.string().default('public'),
  });

  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(httpStatusCode.BAD_REQUEST).json({
      message: new Error(error.message),
    });
  }
};

export const boardValidation = { createBoard };
