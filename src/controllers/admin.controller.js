import httpStatusCode from '../utils/constants.util.js';
import adminService from '../services/admin.service.js';

const signUp = async (req, res) => {
  try {
    const newAdmin = await adminService.signUp(req.body);
    res
      .status(httpStatusCode.CREATED)
      .json({ message: 'Successfully create new admin.', newAdmin });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { user, matchPassword, token } = await adminService.signIn(req.body);
    console.log(user);

    if (!user)
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: 'Admin not found!' });

    if (!matchPassword)
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: 'Wrong password!' });

    if (!user.isAdmin)
      return res
        .status(httpStatusCode.UNAUTHORIZED)
        .json({ message: 'Unauthorized.' });

    delete user.password;

    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully sign in.', user: { ...user, token } });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await adminService.getWorkspaces();
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully get workspaces.', workspaces });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully get users.', users });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const deletedBoard = await adminService.deleteBoard(boardId);
    res
      .status(httpStatusCode.OK)
      .json({ message: 'Successfully deleted board.', deletedBoard });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await adminService.updateUser(userId, req.body);

    res.status(httpStatusCode.OK).json({
      message: 'Successfully updated user info.',
      updatedUser,
    });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const adminController = {
  signIn,
  signUp,
  getWorkspaces,
  getUsers,
  deleteBoard,
  updateUser,
};

export default adminController;
