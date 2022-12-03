import express from 'express';
import userValidation from '../validations/user.validation.js';
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const adminRouter = express.Router();

adminRouter.post('/sign-up', userValidation.signUp, adminController.signUp);
adminRouter.post('/sign-in', userValidation.signIn, adminController.signIn);
adminRouter.get(
  '/workspaces',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getWorkspaces,
);
adminRouter.get(
  '/users',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getUsers,
);
adminRouter.put(
  '/board/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.deleteBoard,
);
adminRouter.put(
  '/user/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.updateUser,
);

export default adminRouter;
