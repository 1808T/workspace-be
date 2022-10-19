import Joi from 'joi';
import httpStatusCode from '../utils/constants.util.js';

const createCard = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().min(3).max(32).required(),
    boardId: Joi.string().required(),
    listId: Joi.string().required(),
  });

  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(httpStatusCode.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

const updateCardTitle = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().min(3).max(32),
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

const cardValidation = { createCard, updateCardTitle };

export default cardValidation;
