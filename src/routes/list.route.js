import express from 'express';
import listValidation from '../validations/list.validation.js';
import listController from '../controllers/list.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const listRouter = express.Router();

listRouter.post(
  '/list',
  authMiddleware.verifyToken,
  listValidation.createList,
  listController.createList,
);

listRouter.put(
  '/list/:id',
  authMiddleware.verifyToken,
  listValidation.updateListTitle,
  listController.updateListTitle,
);

listRouter.delete(
  '/list/:id',
  authMiddleware.verifyToken,
  listController.deleteList,
);

export default listRouter;
