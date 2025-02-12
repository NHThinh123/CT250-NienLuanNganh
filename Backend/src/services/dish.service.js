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

//Api upload nhiều ảnh
// const uploadMultipleImagesService = async (imagePaths) => {
//   try {
//     const uploadPromises = imagePaths.map((path) =>
//       cloudinary.uploader.upload(path, { folder: "dishes" })
//     );
//     const uploadResults = await Promise.all(uploadPromises);
//     return uploadResults.map((result) => result.secure_url); // Trả về danh sách URL
//   } catch (error) {
//     throw new Error("Upload images failed: " + error.message);
//   }
// };

// Hàm tạo món ăn với nhiều ảnh
// const createDishService = async (dishData, imagePaths) => {
//   let imageUrls = dishData.dish_url || []; // Giữ nguyên nếu có sẵn URL

//   if (imagePaths && imagePaths.length > 0) {
//     const uploadedUrls = await uploadMultipleImagesService(imagePaths);
//     imageUrls = [...imageUrls, ...uploadedUrls]; // Gộp ảnh mới vào danh sách
//   }

//   return await Dish.create({ ...dishData, dish_url: imageUrls });
// };

// Hàm cập nhật món ăn với nhiều ảnh
// const updateDishService = async (id, dataUpdate, imagePaths) => {
//   let imageUrls = dataUpdate.dish_url || [];

//   if (imagePaths && imagePaths.length > 0) {
//     const uploadedUrls = await uploadMultipleImagesService(imagePaths);
//     imageUrls = [...imageUrls, ...uploadedUrls];
//   }

//   return await Dish.findByIdAndUpdate(id, { ...dataUpdate, dish_url: imageUrls }, { new: true });
// };

module.exports = {
  getListDishService,
  getDishByIdService,
  createDishService,
  updateDishService,
  deleteDishService,
};
