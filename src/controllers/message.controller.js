import httpStatusCode from '../utils/constants.util.js';
import messageService from '../services/message.service.js';

const createMessage = async (req, res) => {
  try {
    const { data } = req;
    const newMessage = await messageService.createMessage(data);
    res
      .status(httpStatusCode.CREATED)
      .json({ message: 'Successfully created new message.', newMessage });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const messageController = { createMessage };

export default messageController;
