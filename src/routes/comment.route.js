import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import commentValidation from '../validations/comment.validation.js';
import commentController from '../controllers/comment.controller.js';

const commentRouter = express.Router();

commentRouter.post(
  '/',
  authMiddleware.verifyToken,
  commentValidation.createComment,
  commentController.createComment,
);

commentRouter.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyCommentAuthor,
  commentValidation.editComment,
  commentController.editComment,
);

commentRouter.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyCommentAuthor,
  commentController.deleteComment,
);

commentRouter.get(
  '/:cardId',
  authMiddleware.verifyToken,
  commentController.getComments,
);

commentRouter.put(
  '/like/:id',
  authMiddleware.verifyToken,
  commentController.likeComment,
);

commentRouter.put(
  '/unlike/:id',
  authMiddleware.verifyToken,
  commentController.unlikeComment,
);

export default commentRouter;
