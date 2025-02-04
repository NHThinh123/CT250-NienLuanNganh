const Dish = require("../models/dish.model");
const AppError = require("../utils/AppError");

//Tạo một món ăn
const createDishService = async (
  dish_name,
  dish_description,
  dish_price,
  dish_url
) => {
  let result = await Dish.create({
    dish_name: dish_name,
    dish_description: dish_description,
    dish_price: dish_price,
    dish_url: dish_url,
  });
  return result;
};

//Cập nhật thông tin món
const updateDishService = async (id, body) => {
  let result = await Dish.findByIdAndUpdate(id, body, {
    new: true,
  });
  return result;
};

//Tìm món theo tên món
const searchDishService = async (name) => {
  let result = [];
  if (name) {
    result = await Dish.find({
      dish_name: new RegExp(name, "i"),
    });
  } else {
    result = await Dish.find();
  }
  return result;
};

//Tìm món theo id món
const findByIdDishService = async (dish_id) => {
  let result = [];
  result = await Dish.findById(dish_id);
  return result;
};

//Tìm tất cả món
const findAllDishService = async () => {
  let result = [];
  result = await Dish.find();
  return result;
};

//Xóa một món theo id
const deleteDishService = async (dish_id) => {
  let result = await Dish.findByIdAndDelete(dish_id);
  return result;
};

//Xóa tất cả
const deleteAllDishService = async () => {
  await Dish.deleteMany({});
};

module.exports = {
  createDishService,
  updateDishService,
  searchDishService,
  findByIdDishService,
  findAllDishService,
  deleteDishService,
  deleteAllDishService,
};
