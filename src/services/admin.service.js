import userModel from '../models/user.model.js';
import { db } from '../configs/db.config.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validateSchema from '../utils/validate-schema.util.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { ObjectId } from 'mongodb';
import listService from './list.service.js';
import cardService from './card.service.js';

const signUp = async (data) => {
  try {
    const validatedData = await validateSchema(userModel, data);
    const { password } = validatedData;
    const hashedPassword = await hashPassword(password);

    delete validatedData.repeatPassword;
    validatedData.password = hashedPassword;
    validatedData.isAdmin = true;

    const result = await db.users.insertOne(validatedData);
    if (result.acknowledged) {
      const newAdmin = await db.users.findOne({
        _id: result.insertedId,
      });
      delete newAdmin.password;
      return newAdmin;
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

const getWorkspaces = async () => {
  try {
    const workspaces = await db.boards
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            pipeline: [{ $project: { avatar: 1, username: 1 } }],
            as: 'owner',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'members',
            foreignField: '_id',
            pipeline: [{ $project: { avatar: 1, username: 1 } }],
            as: 'members',
          },
        },
      ])
      .toArray();
    return workspaces;
  } catch (error) {
    throw new Error(error);
  }
};

const getUsers = async () => {
  try {
    const users = await db.users
      .find({ isAdmin: false }, { projection: { password: 0 } })
      .toArray();
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

const getBoardDetail = async (boardId) => {
  try {
    const result = await await db.boards
      .aggregate([
        { $match: { _id: new ObjectId(boardId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            pipeline: [{ $project: { avatar: 1, username: 1 } }],
            as: 'owner',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'members',
            foreignField: '_id',
            pipeline: [{ $project: { avatar: 1, username: 1 } }],
            as: 'members',
          },
        },
      ])
      .toArray();
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

const updateBoard = async (boardId, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };
    const result = await db.boards.findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' },
    );
    if (result.value) {
      return result.value;
    } else {
      throw new Error('No document found.');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBoard = async (boardId) => {
  try {
    const data = { updatedAt: Date.now(), _destroy: true };
    const result = await db.boards.findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: data },
      { returnDocument: 'after' },
    );
    if (result.value) {
      await listService.deleteListsByBoardId(boardId);
      await cardService.deleteCardByBoardId(boardId);
      return result.value;
    } else {
      throw new Error('No document found.');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (userId, data) => {
  try {
    const updatedData = { ...data, updatedAt: Date.now() };
    const result = await db.users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updatedData },
      { returnDocument: 'after' },
    );
    if (result.value) {
      return result.value;
    } else {
      throw new Error('No document found.');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getStatistic = async () => {
  try {
    const totalUsers = await db.users.find({}).count();
    const totalTasks = await db.cards.find({}).count();
    const totalFinishTasks = await db.cards.find({ isCompleted: true }).count();
    const totalTodayTasks = await db.cards
      .aggregate([
        { $addFields: { createdDate: { $day: { $toDate: '$createdAt' } } } },
      ])
      .toArray();
    console.log(totalTodayTasks);
  } catch (error) {
    throw new Error(error);
  }
};

const getAnalytic = async () => {};

const adminService = {
  signIn,
  signUp,
  getWorkspaces,
  getUsers,
  getBoardDetail,
  updateBoard,
  deleteBoard,
  updateUser,
  getStatistic,
};

export default adminService;
