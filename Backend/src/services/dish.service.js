const Dish = require("../models/dish.model");

const getListDishService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const query = search ? { dish_name: { $regex: search, $options: "i" } } : {};

  const dishes = await Dish.find(query)
    .populate("menu_id", "menu_name")
    .skip(skip)
    .limit(limit);
  const total = await Dish.countDocuments(query);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: dishes,
  };
};

const getDishByIdService = async (id) => {
  return await Dish.findById(id)
    .populate("menu_id", "menu_name");
};

const createDishService = async (dishData) => {
  return await Dish.create(dishData);
};

const updateDishService = async (id, dataUpdate) => {
  return await Dish.findByIdAndUpdate(id, dataUpdate, { new: true });
};

const deleteDishService = async (id) => {
  return await Dish.delete({ _id: id });
};


module.exports = {
  getListDishService,
  getDishByIdService,
  createDishService,
  updateDishService,
  deleteDishService,
};
