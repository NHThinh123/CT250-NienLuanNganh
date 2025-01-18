require("dotenv").config();

const getUserService = async () => {
  return {
    message: "Hello user!",
  };
};
module.exports = { getUserService };
