import { ObjectId } from 'mongodb';
import boardModel from '../models/board.model.js';
import { db } from '../configs/db.config.js';
import validateSchema from '../utils/validate-schema.util.js';

const createBoard = async (data) => {
  try {
    const validatedData = await validateSchema(boardModel, data);
    validatedData.owner = new ObjectId(validatedData.owner);
    const result = await db.boards.insertOne(validatedData);
    if (result.acknowledged) {
      return await db.boards.findOne({
        _id: result.insertedId,
      });
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

const updateBoardTitle = async (id, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };
    const result = await db.boards.findOneAndUpdate(
      { _id: new ObjectId(id) },
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

const boardService = {
  createBoard,
  updateListsOrder,
  updateBoardTitle,
  deleteBoard,
};

export default boardService;
