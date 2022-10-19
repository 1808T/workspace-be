import httpStatusCode from '../utils/constants.util.js';
import boardService from '../services/board.service.js';

const createBoard = async (req, res) => {
  const { data } = req;
  try {
    const newBoard = await boardService.createBoard(data);
    res
      .status(httpStatusCode.CREATED)
      .json({ message: 'Successfully created new board.', newBoard });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateBoardTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBoard = await boardService.updateBoardTitle(id, req.body);
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully updated board.', updatedBoard });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBoard = await boardService.deleteBoard(id);
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully deleted board.', deletedBoard });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const boardController = { createBoard, updateBoardTitle, deleteBoard };

export default boardController;
