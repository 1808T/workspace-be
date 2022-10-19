import httpStatusCode from '../utils/constants.util.js';
import listService from '../services/list.service.js';

const createList = async (req, res) => {
  try {
    const { newList, updatedBoard } = await listService.createList(req.body);
    res.status(httpStatusCode.CREATED).json({
      message: 'Successfully created new list.',
      newList,
      updatedBoard,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateListTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedList = await listService.updateListTitle(id, req.body);
    res.status(httpStatusCode.OK).json({
      message: 'Successfully updated list.',
      updatedList,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedList = await listService.deleteList(id);
    res.status(httpStatusCode.OK).json({
      message: 'Successfully deleted list.',
      deletedList,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const listController = { createList, updateListTitle, deleteList };

export default listController;
