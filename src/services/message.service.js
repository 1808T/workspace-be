import messageModel from '../models/message.model.js';
import validateSchema from '../utils/validate-schema.util.js';
import { db } from '../configs/db.config.js';
import { ObjectId } from 'mongodb';

const createMessage = async (data) => {
  try {
    const validatedData = await validateSchema(messageModel, data);
    for (let i = 0; i < validatedData.receiver.length; i++) {
      validatedData.receiver[i] = new ObjectId(validatedData.receiver[i]);
    }
    const result = await db.messages.insertOne(validatedData);
    if (result.acknowledged) {
      return await db.messages.findOne({ _id: result.insertedId });
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const messageService = { createMessage };

export default messageService;
