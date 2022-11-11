import listModel from '../models/list.model.js';
import { ObjectId } from 'mongodb';
import { db } from '../configs/db.config.js';
import boardService from './board.service.js';
import validateSchema from '../utils/validate-schema.util.js';

const createList = async (data) => {
  try {
    const validatedData = await validateSchema(listModel, data);
    validatedData.boardId = new ObjectId(validatedData.boardId);
    const addNewListResult = await db.lists.insertOne(validatedData);
    if (addNewListResult.acknowledged) {
      const newList = await db.lists.findOne({
        _id: addNewListResult.insertedId,
      });
      newList.cards = [];
      const { boardId } = newList;
      const listId = newList._id;
      const updatedBoard = await boardService.pushListsOrder(boardId, listId);

      return { newList, updatedBoard };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const unshiftCardsOrder = async (listId, cardId) => {
  try {
    const result = await db.lists.findOneAndUpdate(
      { _id: listId },
      {
        $push: { cardsOrder: { $each: [cardId], $position: 0 } },
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

const updateList = async (id, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };
    const result = await db.lists.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' },
    );

    if (result.value) {
      return result.value;
    } else {
      throw new Error('No document match.');
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const deleteList = async (id) => {
  try {
    const data = { updatedAt: Date.now(), _destroy: true };
    const deleteListResult = await db.lists.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' },
    );

    if (deleteListResult.value) {
      const deletedList = deleteListResult.value;
      console.log(deletedList);
      const { boardId } = deletedList;
      const listId = deletedList._id;
      const updatedBoard = await boardService.deleteListFromListOrder(
        boardId,
        listId,
      );
      return { deletedList, updatedBoard };
    } else {
      throw new Error('No document found.');
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const listService = {
  createList,
  unshiftCardsOrder,
  updateList,
  deleteList,
};

export default listService;
