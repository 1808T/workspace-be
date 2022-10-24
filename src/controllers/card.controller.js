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

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedList = await cardService.updateCard(id, req.body);

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

const searchCards = async (req, res) => {
  const { query } = req.body;
  const userId = req.userId;
  try {
    const searchedCards = await cardService.searchCards(query, userId);
    if (searchedCards.length === 0) {
      res.status(httpStatusCode.OK).json({ message: 'No cards found.' });
    } else {
      res
        .status(httpStatusCode.OK)
        .json({ message: 'Successfully search cards.', searchedCards });
    }
  } catch (error) {
    console.log(error);

    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getAllCards = async (req, res) => {
  try {
    const allCards = await cardService.getAllCards(req.userId);

    if (allCards.length === 0) {
      res.status(httpStatusCode.OK).json({ message: 'No cards found.' });
    } else {
      res
        .status(httpStatusCode.OK)
        .json({ message: 'Successfully get all cards.', allCards });
    }
  } catch (error) {
    console.log(error);

    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getTodayDueCards = async (req, res) => {
  try {
    const todayCards = await cardService.getTodayDueCards(req.userId);

    if (todayCards.length === 0) {
      res.status(httpStatusCode.OK).json({ message: 'No cards found.' });
    } else {
      res
        .status(httpStatusCode.OK)
        .json({ message: 'Successfully get all today cards.', todayCards });
    }
  } catch (error) {
    console.log(error);

    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getMonthlyDoneCards = async (req, res) => {
  try {
    const { allCardsCurrentYear, monthlyDoneCards } =
      await cardService.getMonthlyDoneCards(req.userId);

    if (allCardsCurrentYear.length === 0) {
      res.status(httpStatusCode.OK).json({ message: 'No cards found.' });
    } else {
      res.status(httpStatusCode.OK).json({
        message: 'Successfully get all this month cards.',
        monthlyDoneCards,
      });
    }
  } catch (error) {
    console.log(error);

    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const cardController = {
  createCard,
  updateCard,
  deleteCard,
  searchCards,
  getAllCards,
  getTodayDueCards,
  getMonthlyDoneCards,
};

export default cardController;
