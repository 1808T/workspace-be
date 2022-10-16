import bcrypt from 'bcrypt';
import userSchema from '../models/user.model.js';
import { db } from '../configs/db.config.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const validateUserSchema = async (data) => {
  try {
    return await userSchema.validateAsync(data, { abortEarly: false });
  } catch (error) {
    console.log(error.message);
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  return await bcrypt.hash(password, salt);
};

const comparePassword = async (string, hashedPassword) => {
  return await bcrypt.compare(string, hashedPassword);
};

const signUp = async (data) => {
  try {
    const value = await validateUserSchema(data);
    const { password } = value;
    const hashedPassword = await hashPassword(password);

    delete value.repeatPassword;
    value.password = hashedPassword;

    const result = await db.users.insertOne(value);
    if (result.insertedId) {
      const newUser = await db.users.findOne({
        _id: result.insertedId,
      });
      return newUser;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const signIn = async (data) => {
  try {
    const { email, password } = data;
    const result = {};
    result.user = await db.users.findOne(
      { email },
      {
        projection: {
          boardList: 0,
          friends: 0,
          isAdmin: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    );
    if (result.user) {
      result.matchPassword = await comparePassword(
        password,
        result.user.password,
      );
      result.token = authMiddleware.generateToken(result.user._id);
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userService = { signUp, signIn };
