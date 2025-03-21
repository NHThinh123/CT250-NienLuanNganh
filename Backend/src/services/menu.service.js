const Menu = require("../models/menu.model");
const AppError = require("../utils/AppError");

const getListMenuService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const query = search ? { menu_name: { $regex: search, $options: "i" } } : {};

  const menus = await Menu.find(query)
    .populate("business_id", "business_name")
    .skip(skip)
    .limit(limit);
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
  return await Menu.findById(id)
    .populate("business_id", "business_name");
};

const createMenuService = async (menu_name, business_id) => {
  if (!menu_name || !business_id) {
    throw new AppError("Missing required fields", 400);
  }
  let result = await Menu.create({ menu_name: menu_name, business_id: business_id });
  return result;
};

const updateMenuService = async (id, dataUpdate) => {
  return await Menu.findByIdAndUpdate(id, dataUpdate, { new: true });
};

const deleteMenuService = async (id) => {
  return await Menu.delete({ _id: id });
};

const getMenusByBusinessIdService = async (businessId) => {
    try {
        const menus = await Menu.find({ business_id: businessId });
        return menus;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
  getListMenuService,
  getMenuByIdService,
  createMenuService,
  updateMenuService,
  deleteMenuService,
  getMenusByBusinessIdService
};
