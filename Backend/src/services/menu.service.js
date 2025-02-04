const Menu = require("../models/menu.model");

const getListMenuService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const query = search ? { menu_name: { $regex: search, $options: "i" } } : {};

  const menus = await Menu.find(query).skip(skip).limit(limit);
  const total = await Menu.countDocuments(query);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: menus,
  };
};

const getMenuByIdService = async (id) => {
  return await Menu.findById(id);
};

const createMenuService = async (menu_name) => {
  return await Menu.create({ menu_name });
};

const updateMenuService = async (id, dataUpdate) => {
  return await Menu.findByIdAndUpdate(id, dataUpdate, { new: true });
};

const deleteMenuService = async (id) => {
  return await Menu.delete({ _id: id });
};

module.exports = {
  getListMenuService,
  getMenuByIdService,
  createMenuService,
  updateMenuService,
  deleteMenuService,
};
