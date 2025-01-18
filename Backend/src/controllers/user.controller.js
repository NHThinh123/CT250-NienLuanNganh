const {
  createUserService,
  getListUserService,
  helloUserService,
} = require("../services/user.service");

const getListUser = async (req, res, next) => {
  try {
    const data = await getListUserService();
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
const helloUser = async (req, res, next) => {
  try {
    const data = await helloUserService();
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, username, password, role } = req.body;
    const data = await createUserService(email, username, password, role);
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { helloUser, createUser, getListUser };
