import { db } from '../configs/db.config.js';
import { ObjectId } from 'mongodb';
import cardModel from '../models/card.model.js';
import validateSchema from '../utils/validate-schema.util.js';
import listService from './list.service.js';
import { toTimeStamp } from '../utils/convert-date.util.js';

const createCard = async (data) => {
  try {
    const validatedData = await validateSchema(cardModel, data);
    if (validatedData.inCharge) {
      validatedData.inCharge = new ObjectId(validatedData.inCharge);
    }
    validatedData.boardId = new ObjectId(validatedData.boardId);
    validatedData.listId = new ObjectId(validatedData.listId);
    if (validatedData.endedAt) {
      validatedData.endedAt = toTimeStamp(updateData.endedAt);
    }
    const result = await db.cards.insertOne(validatedData);
    if (result.acknowledged) {
      const newCard = await db.cards.findOne({
        _id: result.insertedId,
      });
      const { listId } = newCard;
      const updatedList = await listService.updateCardsOrder(
        listId,
        newCard._id,
      );

      return { newCard, updatedList };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const updateCard = async (id, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };
    if (updateData.inCharge) {
      updateData.inCharge = new ObjectId(updateData.inCharge);
    }
    if (updateData.endedAt) {
      updateData.endedAt = toTimeStamp(updateData.endedAt);
    }
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
      throw new Error('No document found.');
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const searchCards = async (data, userId) => {
  const trimData = data.trim();
  const query = new RegExp(trimData, 'i');
  try {
    const result = await db.cards
      .aggregate([
        { $match: { title: { $regex: query } } },
        {
          $lookup: {
            from: 'boards',
            localField: 'boardId',
            foreignField: '_id',
            as: 'board',
          },
        },
        { $match: { 'board.members': { $in: [userId] } } },
        { $project: { board: 0 } },
      ])
      .toArray();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getAllCards = async (userId) => {
  try {
    return await db.cards
      .find({
        inCharge: userId,
        _destroy: false,
      })
      .toArray();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getTodayDueCards = async (userId) => {
  try {
    const date = new Date();
    const today = toTimeStamp(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    );
    return await db.cards
      .find({
        inCharge: userId,
        endedAt: today,
        _destroy: false,
      })
      .toArray();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getMonthlyDoneCards = async (userId) => {
  const currentYear = new Date().getFullYear();
  try {
    const allCardsCurrentYear = await db.cards
      .aggregate([
        { $match: { inCharge: userId, _destroy: false, isCompleted: true } },
        { $addFields: { endYear: { $year: { $toDate: '$endedAt' } } } },
        { $addFields: { endMonth: { $month: { $toDate: '$endedAt' } } } },
        { $match: { endYear: currentYear } },
        { $sort: { endedAt: 1 } },
      ])
      .toArray();
    const monthlyDoneCards = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    };
    allCardsCurrentYear.forEach((card) => {
      monthlyDoneCards[card.endMonth] = monthlyDoneCards[card.endMonth] + 1;
    });
    return { allCardsCurrentYear, monthlyDoneCards };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const cardService = {
  createCard,
  updateCard,
  deleteCard,
  searchCards,
  getAllCards,
  getTodayDueCards,
  getMonthlyDoneCards,
};

export default cardService;
