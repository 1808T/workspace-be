import express from 'express';
import cardValidation from '../validations/card.validation.js';
import cardController from '../controllers/card.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const cardRouter = express.Router();

cardRouter.post(
  '/',
  authMiddleware.verifyToken,
  cardValidation.createCard,
  cardController.createCard,
);

cardRouter.put(
  '/:id',
  authMiddleware.verifyToken,
  cardValidation.updateCard,
  cardController.updateCard,
);

cardRouter.delete(
  '/:id',
  authMiddleware.verifyToken,
  cardController.deleteCard,
);

cardRouter.get(
  '/search',
  authMiddleware.verifyToken,
  cardValidation.searchCards,
  cardController.searchCards,
);

cardRouter.get(
  '/your-cards',
  authMiddleware.verifyToken,
  cardController.getAllCards,
);

cardRouter.get(
  '/due',
  authMiddleware.verifyToken,
  cardController.getTodayDueCards,
);

cardRouter.get(
  '/monthly',
  authMiddleware.verifyToken,
  cardController.getMonthlyDoneCards,
);

export default cardRouter;
