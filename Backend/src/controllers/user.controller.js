const {
  getUserService,
  createUserService,
} = require("../services/user.service");

const helloUser = async (req, res, next) => {
  try {
    const data = await getUserService();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, username, password, role } = req.body;
    const data = await createUserService(email, username, password, role);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { helloUser, createUser };
