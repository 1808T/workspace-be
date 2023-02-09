import commentService from '../services/comment.service.js';
import httpStatusCode from '../utils/constants.util.js';

const createComment = async (req, res) => {
  try {
    const newComment = await commentService.createComment(req.body);
    res.status(httpStatusCode.CREATED).json({
      message: 'Successfully created new comment.',
      newComment,
    });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { cardId } = req.params;
    const allComments = await commentService.getComments(cardId);
    res.status(httpStatusCode.OK).json({
      message: 'Successfully get all comments',
      allComments,
    });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const editedComment = await commentService.editComment(id, req.body);
    res.status(httpStatusCode.OK).json({
      message: 'Successfully edited comment',
      editedComment,
    });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await commentService.deleteComment(id);
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully deleted comment', deletedComment });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const likeComment = await commentService.likeComment(id, userId);
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully like comment', likeComment });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const unlikeComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const { id } = req.params;
    const unlikeComment = await commentService.unlikeComment(id, userId);
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully unlike comment', unlikeComment });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const commentController = {
  createComment,
  getComments,
  editComment,
  deleteComment,
  likeComment,
  unlikeComment,
};

export default commentController;
