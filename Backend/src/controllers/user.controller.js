const { getUserService } = require("../services/user.service");

const helloUser = async (req, res) => {
  const data = await getUserService();
  res.status(200).json(data);
};

module.exports = { helloUser };
