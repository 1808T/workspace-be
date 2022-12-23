import userModel from '../models/user.model.js';
import { db } from '../configs/db.config.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validateSchema from '../utils/validate-schema.util.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { ObjectId } from 'mongodb';
import listService from './list.service.js';
import cardService from './card.service.js';
import { toDate, getWeek } from '../utils/convert-date.util.js';

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

const getBoards = async (page, sortField, ascendingOrder) => {
  let order = 1;
  try {
    const workspacesPerPage = 5;
    const totalPages = Math.ceil(
      (await db.boards.countDocuments({})) / workspacesPerPage,
    );
    const skipWorkspaces = workspacesPerPage * (page - 1);
    if (ascendingOrder === 'true') {
      order = 1;
    } else {
      order = -1;
    }
    const workspaces = await db.boards
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 0, username: 1 } }],
            as: 'ownerUsername',
          },
        },
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
        { $sort: { [sortField]: order } },
      ])
      .skip(skipWorkspaces)
      .limit(workspacesPerPage)
      .toArray();
    return { workspaces, totalPages };
  } catch (error) {
    throw new Error(error);
  }
};

const getUsers = async (page, sortField, ascendingOrder) => {
  let order = 1;
  try {
    if (ascendingOrder === 'true') {
      order = 1;
    } else {
      order = -1;
    }
    const usersPerPage = 5;
    const totalPages = Math.ceil(
      (await db.users.countDocuments({ isAdmin: false })) / usersPerPage,
    );
    const skipUsers = usersPerPage * (page - 1);
    const users = await db.users
      .find({ isAdmin: false }, { projection: { password: 0 } })
      .sort({ [sortField]: order })
      .skip(skipUsers)
      .limit(usersPerPage)
      .toArray();
    return { users, totalPages };
  } catch (error) {
    throw new Error(error);
  }
};

const updateBoard = async (boardId, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };
    if (updateData.members && updateData.members.length !== 0) {
      updateData.members.forEach(
        (member, index) => (updateData.members[index] = new ObjectId(member)),
      );
    }
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
    const totalUsers = await db.users.countDocuments({ isAdmin: false });
    const totalTasks = await db.cards.countDocuments();
    const totalFinishTasks = await db.cards.countDocuments({
      isCompleted: true,
    });
    const currentDate = toDate(Date.now());
    const todayTasks = await db.cards
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    const totalTodayTasks = todayTasks.filter(
      (task) => toDate(task.createdAt) === currentDate,
    ).length;
    return { totalUsers, totalTasks, totalFinishTasks, totalTodayTasks };
  } catch (error) {
    throw new Error(error);
  }
};

const getAnalytic = async () => {
  try {
    const currentWeek = getWeek(new Date());
    const weeklyCreatedTasks = await db.cards
      .aggregate([
        { $addFields: { createdWeek: { $week: { $toDate: '$createdAt' } } } },
        { $match: { createdWeek: currentWeek } },
        { $sort: { createdWeek: -1 } },
        {
          $addFields: { dayOfWeek: { $dayOfWeek: { $toDate: '$createdAt' } } },
        },
        { $project: { title: 1, dayOfWeek: 1 } },
      ])
      .toArray();
    const weeklyFinishedTasks = await db.cards
      .aggregate([
        { $match: { _destroy: false, isCompleted: true } },
        { $addFields: { endWeek: { $week: { $toDate: '$endedAt' } } } },
        { $match: { endWeek: currentWeek } },
        { $sort: { endWeek: -1 } },
        {
          $addFields: { dayOfWeek: { $dayOfWeek: { $toDate: '$endedAt' } } },
        },
        { $project: { title: 1, dayOfWeek: 1 } },
      ])
      .toArray();
    const weeklyNewUsers = await db.users
      .aggregate([
        { $match: { isAdmin: false } },
        { $addFields: { createdWeek: { $week: { $toDate: '$createdAt' } } } },
        { $match: { createdWeek: currentWeek } },
        { $sort: { createdWeek: -1 } },
        {
          $addFields: { dayOfWeek: { $dayOfWeek: { $toDate: '$createdAt' } } },
        },
        { $project: { username: 1, dayOfWeek: 1 } },
      ])
      .toArray();

    return {
      weeklyCreatedTasks: weeklyCreatedTasks.reduce(
        (result, task) => {
          result[task.dayOfWeek] = result[task.dayOfWeek] + 1;
          return result;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      ),
      weeklyFinishedTasks: weeklyFinishedTasks.reduce(
        (result, task) => {
          result[task.dayOfWeek] = result[task.dayOfWeek] + 1;
          return result;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      ),
      weeklyNewUsers: weeklyNewUsers.reduce(
        (result, user) => {
          result[user.dayOfWeek] = result[user.dayOfWeek] + 1;
          return result;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      ),
    };
  } catch (error) {
    throw new Error(error);
  }
};

const searchBoard = async (data) => {
  const trimData = data.trim();
  const query = new RegExp(trimData, 'i');
  try {
    const result = await db.boards
      .aggregate([
        { $match: { title: { $regex: query } } },
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
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const searchUser = async (data) => {
  const trimData = data.trim();
  const query = new RegExp(trimData, 'i');
  try {
    const result = await db.users
      .find(
        { username: { $regex: query }, isAdmin: false },
        { projection: { password: 0 } },
      )
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const adminService = {
  signIn,
  signUp,
  getBoards,
  getUsers,
  updateBoard,
  deleteBoard,
  updateUser,
  getStatistic,
  getAnalytic,
  searchBoard,
  searchUser,
};

export default adminService;
