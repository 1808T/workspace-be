import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { boardValidation } from '../validations/board.validation.js';

const boardRouter = express.Router();

boardRouter.post(
  '/board',
  authMiddleware.verifyToken,
  boardValidation.createBoard,
);

export default boardRouter;
