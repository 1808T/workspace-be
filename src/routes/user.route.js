import express from 'express';
import userValidation from '../validations/user.validation.js';
import userController from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/sign-up', userValidation.signUp, userController.signUp);
userRouter.post('/sign-in', userValidation.signIn, userController.signIn);

export default userRouter;
