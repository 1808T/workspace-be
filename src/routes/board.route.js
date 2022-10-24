import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import boardValidation from '../validations/board.validation.js';
import boardController from '../controllers/board.controller.js';

const boardRouter = express.Router();

boardRouter.post(
  '/',
  authMiddleware.verifyToken,
  boardValidation.createBoard,
  boardController.createBoard,
);

boardRouter.put(
  '/title/:boardId',
  authMiddleware.verifyToken,
  boardValidation.updateBoardTitle,
  boardController.updateBoardTitle,
);

boardRouter.delete(
  '/:id',
  authMiddleware.verifyToken,
  boardController.deleteBoard,
);

boardRouter.get(
  '/your-boards',
  authMiddleware.verifyToken,
  boardController.getYourBoards,
);

boardRouter.get(
  '/invited-boards',
  authMiddleware.verifyToken,
  boardController.getInvitedBoards,
);

export default boardRouter;
