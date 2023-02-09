import commentModel from '../models/comment.model.js';
import validateSchema from '../utils/validate-schema.util.js';
import { db } from '../configs/db.config.js';
import { ObjectId } from 'mongodb';

const createComment = async (data) => {
  try {
    const validatedData = await validateSchema(commentModel, data);
    validatedData.card = new ObjectId(validatedData.card);
    validatedData.author = new ObjectId(validatedData.author);
    if (validatedData.parentId) {
      validatedData.parentId = new ObjectId(validatedData.parentId);
    }
    const result = await db.comments.insertOne(validatedData);
    if (result.acknowledged) {
      const newComment = await db.comments
        .aggregate([
          { $match: { _id: result.insertedId } },
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              pipeline: [{ $project: { avatar: 1, username: 1 } }],
              as: 'author',
            },
          },
        ])
        .toArray();

      return newComment[0];
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getComments = async (cardId) => {
  try {
    const allComments = await db.comments
      .aggregate([
        { $match: { card: new ObjectId(cardId), _destroy: false } },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            pipeline: [{ $project: { avatar: 1, username: 1 } }],
            as: 'author',
          },
        },
      ])
      .toArray();

    return allComments;
  } catch (error) {
    throw new Error(error);
  }
};

const editComment = async (id, data) => {
  try {
    const updateData = { ...data, updatedData: Date.now() };
    const result = await db.comments.findOneAndUpdate(
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
    throw new Error(error);
  }
};

const deleteComment = async (id) => {
  try {
    const updateData = { _destroy: true, updatedData: Date.now() };
    const result = await db.comments.findOneAndUpdate(
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
    throw new Error(error);
  }
};

const likeComment = async (id, userId) => {
  try {
    const result = await db.comments.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $push: { likes: new ObjectId(userId) },
        $set: { updatedAt: Date.now() },
      },
      { returnDocument: 'after' },
    );
    if (result.value) {
      return result.value;
    } else {
      throw new Error('No document match.');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const unlikeComment = async (id, userId) => {
  try {
    const result = await db.comments.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $pull: { likes: new ObjectId(userId) },
        $set: { updatedAt: Date.now() },
      },
      { returnDocument: 'after' },
    );
    if (result.value) {
      return result.value;
    } else {
      throw new Error('No document match.');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const commentService = {
  createComment,
  getComments,
  editComment,
  deleteComment,
  likeComment,
  unlikeComment,
};

export default commentService;
