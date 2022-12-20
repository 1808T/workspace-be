import express from 'express';
import userValidation from '../validations/user.validation.js';
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const adminRouter = express.Router();

adminRouter.post('/sign-up', userValidation.signUp, adminController.signUp);
adminRouter.post('/sign-in', userValidation.signIn, adminController.signIn);
adminRouter.get(
  '/statistic',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getStatistic,
);
adminRouter.get(
  '/analytic',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getAnalytic,
);
adminRouter.get(
  '/board',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getBoards,
);
adminRouter.post(
  '/board/search',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.searchBoard,
);
adminRouter.put(
  '/board/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.updateBoard,
);
adminRouter.delete(
  '/board/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.deleteBoard,
);
adminRouter.get(
  '/user',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getUsers,
);
adminRouter.post(
  '/user/search',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.searchUser,
);
adminRouter.put(
  '/user/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.updateUser,
);

export default adminRouter;
