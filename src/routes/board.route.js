import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import boardValidation from '../validations/board.validation.js';
import boardController from '../controllers/board.controller.js';

const boardRouter = express.Router();

boardRouter.post(
  '/board',
  authMiddleware.verifyToken,
  boardValidation.createBoard,
  boardController.createBoard,
);

boardRouter.put(
  '/board/:id',
  authMiddleware.verifyToken,
  boardValidation.updateBoardTitle,
  boardController.updateBoardTitle,
);

boardRouter.delete(
  '/board/:id',
  authMiddleware.verifyToken,
  boardController.deleteBoard,
);

export default boardRouter;
