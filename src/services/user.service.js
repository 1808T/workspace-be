import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js';
import { db } from '../configs/db.config.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validateSchema from '../utils/validate-schema.util.js';

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
    const validatedData = await validateSchema(userModel, data);
    const { password } = validatedData;
    const hashedPassword = await hashPassword(password);

    delete validatedData.repeatPassword;
    validatedData.password = hashedPassword;

    const result = await db.users.insertOne(validatedData);
    if (result.acknowledged) {
      const newUser = await db.users.findOne({
        _id: result.insertedId,
      });
      return newUser;
    }
  } catch (error) {
    console.log(error);
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
    console.log(error);
    throw new Error(error);
  }
};

const updateBoardList = async (userId, boardId) => {
  try {
    const result = await db.users.findOneAndUpdate(
      { _id: userId },
      { $push: { boardList: boardId } },
      { returnDocument: 'after' },
    );
    if (result.value) {
      return result.value;
    } else {
      throw new Error('No document found.');
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const userService = { signUp, signIn, updateBoardList };

export default userService;
