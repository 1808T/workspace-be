import httpStatusCode from '../utils/constants.util.js';
import cardService from '../services/card.service.js';

const createCard = async (req, res) => {
  try {
    const { newCard, updatedList } = await cardService.createCard(req.body);

    res.status(httpStatusCode.CREATED).json({
      message: 'Successfully created new card.',
      newCard,
      updatedList,
    });
  } catch (error) {
    console.log(error);

    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateCardTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedList = await cardService.updateCardTitle(id, req.body);

    res.status(httpStatusCode.OK).json({
      message: 'Successfully updated card.',
      updatedList,
    });
  } catch (error) {
    console.log(error);

    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await cardService.deleteCard(id);

    res.status(httpStatusCode.OK).json({
      message: 'Successfully deleted card.',
      deletedCard,
    });
  } catch (error) {
    console.log(error);

    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const cardController = { createCard, updateCardTitle, deleteCard };

export default cardController;
