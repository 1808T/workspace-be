import httpStatusCode from '../utils/constants.util.js';
import userService from '../services/user.service.js';

const signUp = async (req, res) => {
  try {
    const newUser = await userService.signUp(req.body);
    res
      .status(httpStatusCode.CREATED)
      .json({ message: 'Successfully create new account.', newUser });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { user, matchPassword, token } = await userService.signIn(req.body);

    if (!user)
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: 'User not found!' });

    if (!matchPassword)
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: 'Wrong password!' });

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

const adminSignUp = async (req, res) => {
  try {
    const newAdmin = await userService.adminSignUp(req.body);
    res
      .status(httpStatusCode.CREATED)
      .json({ message: 'Successfully create new admin.', newAdmin });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const adminSignIn = async (req, res) => {
  try {
    const { user, matchPassword, token } = await userService.adminSignIn(
      req.body,
    );

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

const getUserInfo = async (req, res) => {
  try {
    const user = await userService.getUserInfo(req.userId);
    res
      .status(httpStatusCode.CREATED)
      .json({ message: 'Successfully get user info.', user });
  } catch (error) {
    res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const userController = {
  signUp,
  signIn,
  adminSignIn,
  adminSignUp,
  getUserInfo,
};

export default userController;
