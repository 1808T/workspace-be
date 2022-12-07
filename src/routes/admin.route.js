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
  '/workspaces',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getWorkspaces,
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
  '/users',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getUsers,
);
adminRouter.put(
  '/user/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.updateUser,
);

export default adminRouter;
