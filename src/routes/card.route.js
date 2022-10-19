import express from 'express';
import cardValidation from '../validations/card.validation.js';
import cardController from '../controllers/card.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const cardRouter = express.Router();

cardRouter.post(
  '/card',
  authMiddleware.verifyToken,
  cardValidation.createCard,
  cardController.createCard,
);

cardRouter.put(
  '/card/:id',
  authMiddleware.verifyToken,
  cardValidation.updateCardTitle,
  cardController.updateCardTitle,
);

cardRouter.delete(
  '/card/:id',
  authMiddleware.verifyToken,
  cardController.deleteCard,
);

export default cardRouter;
