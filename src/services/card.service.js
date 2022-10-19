import { db } from '../configs/db.config.js';
import { ObjectId } from 'mongodb';
import cardModel from '../models/card.model.js';
import validateSchema from '../utils/validate-schema.util.js';
import listService from './list.service.js';

const createCard = async (data) => {
  try {
    const validatedData = await validateSchema(cardModel, data);
    validatedData.boardId = new ObjectId(validatedData.boardId);
    validatedData.listId = new ObjectId(validatedData.listId);
    const addNewCardResult = await db.cards.insertOne(validatedData);
    if (addNewCardResult.acknowledged) {
      const newCard = await db.cards.findOne({
        _id: addNewCardResult.insertedId,
      });
      const { listId } = newCard;
      const cardId = newCard._id;
      const updatedList = await listService.updateCardsOrder(listId, cardId);

      return { newCard, updatedList };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const updateCardTitle = async (id, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };
    const result = await db.cards.findOneAndUpdate(
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

const deleteCard = async (id) => {
  try {
    const data = { updatedAt: Date.now(), _destroy: true };
    const result = await db.cards.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' },
    );

    if (result.value) {
      return result.value;
    } else {
      throw new Error('No documet found.');
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const cardService = { createCard, updateCardTitle, deleteCard };

export default cardService;
