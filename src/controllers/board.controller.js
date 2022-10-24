import httpStatusCode from '../utils/constants.util.js';
import boardService from '../services/board.service.js';

const createBoard = async (req, res) => {
  try {
    const { newBoard, updatedUser } = await boardService.createBoard(req.body);
    res
      .status(httpStatusCode.CREATED)
      .json({
        message: 'Successfully created new board.',
        newBoard,
        updatedUser,
      });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateBoardTitle = async (req, res) => {
  try {
    const { boardId } = req.params;
    const updatedBoard = await boardService.updateBoardTitle(boardId, req.body);
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

const getYourBoards = async (req, res) => {
  try {
    const yourBoards = await boardService.getYourBoards(req.userId);
    if (yourBoards.length === 0) {
      res
        .status(httpStatusCode.OK)
        .json({ message: "Haven't had your own board? Create new one." });
    } else {
      res
        .status(httpStatusCode.OK)
        .json({ message: 'Successfully get your boards.', yourBoards });
    }
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getInvitedBoards = async (req, res) => {
  try {
    const invitedBoards = await boardService.getInvitedBoards(req.userId);
    if (invitedBoards.length === 0) {
      res.status(httpStatusCode.OK).json({ message: 'No board found.' });
    } else {
      res.status(httpStatusCode.OK).json({
        message: 'Successfully get your invited boards.',
        invitedBoards,
      });
    }
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const boardController = {
  createBoard,
  updateBoardTitle,
  deleteBoard,
  getYourBoards,
  getInvitedBoards,
};

export default boardController;
