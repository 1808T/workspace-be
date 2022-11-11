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
    const result = await db.boards.insertOne(validatedData);
    if (result.acknowledged) {
      const newBoard = await db.boards.findOne({
        _id: result.insertedId,
      });
      newBoard.lists = [];
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

const pushListsOrder = async (boardId, listId) => {
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

const deleteListFromListOrder = async (boardId, listId) => {
  try {
    const result = await db.boards.findOneAndUpdate(
      { _id: boardId },
      {
        $pull: { listsOrder: listId },
        $set: { updatedAt: Date.now() },
      },
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

const getBoardDetail = async (boardId) => {
  try {
    const result = await db.boards
      .aggregate([
        { $match: { _id: new ObjectId(boardId) } },
        {
          $lookup: {
            from: 'lists',
            localField: '_id',
            foreignField: 'boardId',
            pipeline: [{ $match: { _destroy: false } }],
            as: 'lists',
          },
        },
        {
          $lookup: {
            from: 'cards',
            localField: '_id',
            foreignField: 'boardId',
            pipeline: [{ $match: { _destroy: false } }],
            as: 'cards',
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
        {
          $lookup: {
            from: 'users',
            localField: 'cards.inCharge',
            foreignField: '_id',
            pipeline: [{ $project: { avatar: 1, username: 1 } }],
            as: 'inCharge',
          },
        },
      ])
      .toArray();
    const board = result[0];
    board.cards.forEach((card) => {
      if (card.inCharge !== null) {
        card.inCharge = board.inCharge.filter(
          (user) => user._id.toString() === card.inCharge.toString(),
        )[0];
      }
    });
    board.lists.forEach((list) => {
      list.cards = board.cards.filter(
        (card) => card.listId.toString() === list._id.toString(),
      );
    });
    delete board.cards;
    delete board.inCharge;
    return board;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const updateBoard = async (boardId, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };
    const { listsOrder } = updateData;
    if (listsOrder) {
      listsOrder.forEach((listId, index) => {
        listsOrder[index] = new ObjectId(listId);
      });
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

const getBoardProgress = async (id) => {
  try {
    const boards = await db.boards
      .find({
        $or: [
          { owner: id, _destroy: false },
          { members: { $in: [id] }, _destroy: false },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray();
    const firstBoard = boards[0];
    const secondBoard = boards[1];
    const firstBoardCards = await db.cards
      .find({
        boardId: firstBoard._id,
      })
      .toArray();
    const secondBoardCards = await db.cards
      .find({
        boardId: secondBoard._id,
      })
      .toArray();
    boards[0].cards = firstBoardCards;
    boards[1].cards = secondBoardCards;
    return boards;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const boardService = {
  createBoard,
  pushListsOrder,
  deleteListFromListOrder,
  getBoardDetail,
  updateBoard,
  deleteBoard,
  getYourBoards,
  getInvitedBoards,
  getBoardProgress,
};

export default boardService;
