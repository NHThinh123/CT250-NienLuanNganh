const Dish = require("../models/dish.model");
const cloudinary = require("../config/cloudinary");

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

const deleteDishService = async (id) => {
  return await Dish.delete({ _id: id });
};

//Api upload nhiều ảnh
const uploadMultipleImagesService = async (imagePaths) => {
  try {
    const uploadPromises = imagePaths.map((path) =>
      cloudinary.uploader.upload(path, { folder: "dishes" })
    );
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults.map((result) => result.secure_url); // Trả về danh sách URL
  } catch (error) {
    throw new Error("Upload images failed: " + error.message);
  }
};

const createDishService = async (dishData, imagePaths) => {
  let imageUrls = dishData.dish_url || []; // Giữ nguyên nếu có sẵn URL

  if (imagePaths && imagePaths.length > 0) {
    const uploadedUrls = await uploadMultipleImagesService(imagePaths);
    imageUrls = [...imageUrls, ...uploadedUrls]; // Gộp ảnh mới vào danh sách
  }

  return await Dish.create({ ...dishData, dish_url: imageUrls });
};

// Hàm cập nhật món ăn với nhiều ảnh
const updateDishService = async (id, dataUpdate, imagePaths) => {
  // Lấy thông tin món ăn hiện tại từ database
  const existingDish = await Dish.findById(id);
  if (!existingDish) {
    throw new Error("Dish not found");
  }

  let imageUrls = existingDish.dish_url || []; // Giữ ảnh cũ

  // Kiểm tra số lượng ảnh
  if(imageUrls.length = 5) {
    throw new Error("Cannot upload more than images for this dish");
  }

  // Nếu có ảnh mới, upload lên Cloudinary và thêm vào danh sách ảnh cũ
  if (imagePaths && imagePaths.length > 0) {
    const uploadedUrls = await uploadMultipleImagesService(imagePaths);
    imageUrls = [...imageUrls, ...uploadedUrls];
  }

  return await Dish.findByIdAndUpdate(
    id,
    { ...dataUpdate, dish_url: imageUrls }, // Cập nhật dữ liệu + giữ ảnh cũ
    { new: true }
  );
};

const getDishesByMenuIdService = async (menuId) => {
    try {
        const dishes = await Dish.find({ menu_id: menuId });
        return dishes;
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = {
  getListDishService,
  getDishByIdService,
  uploadMultipleImagesService,
  createDishService,
  updateDishService,
  deleteDishService,
  getDishesByMenuIdService
};
