import Joi from 'joi';
import httpStatusCode from '../utils/constants.util.js';

const createComment = async (req, res, next) => {
  req.body.author = req.userId.toString();

  const condition = Joi.object({
    content: Joi.string().trim().required(),
    author: Joi.string().required(),
    card: Joi.string().required(),
  });

  try {
    await condition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    res.status(httpStatusCode.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

const editComment = async (req, res, next) => {
  const condition = Joi.object({
    content: Joi.string().trim().required(),
  });

  try {
    await condition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    res.status(httpStatusCode.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

const commentValidation = { createComment, editComment };

export default commentValidation;
