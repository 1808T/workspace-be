import { ObjectId } from 'mongodb';
import boardModel from '../models/board.model.js';
import userService from './user.service.js';
import { db } from '../configs/db.config.js';
import validateSchema from '../utils/validate-schema.util.js';

const createBoard = async (data) => {
  try {
    const validatedData = await validateSchema(boardModel, data);
    validatedData.owner = new ObjectId(validatedData.owner);
    if (validatedData.members) {
      validatedData.members.forEach(
        (member, i) => (validatedData.members[i] = new ObjectId(member)),
      );
    }
    validatedData.members.unshift(validatedData.owner);
    const result = await db.boards.insertOne(validatedData);
    if (result.acknowledged) {
      const newBoard = await db.boards.findOne({
        _id: result.insertedId,
      });
      const updatedUser = await userService.updateBoardList(
        newBoard.owner,
        newBoard._id,
      );
      return { newBoard, updatedUser };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const updateListsOrder = async (boardId, listId) => {
  try {
    const result = await db.boards.findOneAndUpdate(
      { _id: boardId },
      { $push: { listsOrder: listId }, $set: { updatedAt: Date.now() } },
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

const updateBoardTitle = async (boardId, data) => {
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
    console.log(error);
    throw new Error(error);
  }
};

const deleteBoard = async (id) => {
  try {
    const data = { updatedAt: Date.now(), _destroy: true };
    const result = await db.boards.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
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

const getYourBoards = async (id) => {
  try {
    return await db.boards.find({ owner: id, _destroy: false }).toArray();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getInvitedBoards = async (id) => {
  try {
    return await db.boards
      .find({ members: { $in: [id] }, _destroy: false })
      .toArray();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const boardService = {
  createBoard,
  updateListsOrder,
  updateBoardTitle,
  deleteBoard,
  getYourBoards,
  getInvitedBoards,
};

export default boardService;
