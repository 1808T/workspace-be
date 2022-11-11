import express from 'express';
import userValidation from '../validations/user.validation.js';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const userRouter = express.Router();

// User
userRouter.post('/sign-up', userValidation.signUp, userController.signUp);
userRouter.post('/sign-in', userValidation.signIn, userController.signIn);
userRouter.get(
  '/current-user',
  authMiddleware.verifyToken,
  userController.getUserInfo,
);

// Admin
userRouter.post(
  '/admin/sign-up',
  userValidation.signUp,
  userController.adminSignUp,
);
userRouter.post(
  '/admin/sign-in',
  userValidation.signIn,
  userController.adminSignIn,
);

export default userRouter;
