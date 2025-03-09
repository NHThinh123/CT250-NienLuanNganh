const Dish = require("../models/dish.model");
const cloudinary = require("../config/cloudinary");
const Menu = require("../models/menu.model");

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
  return await Dish.findById(id).populate("menu_id", "menu_name");
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

const createDishService = async (dishData, imagePath) => {
  let imageUrl =
    dishData.dish_url ||
    "https://res.cloudinary.com/nienluan/image/upload/v1741509054/Default_Dish_Image_k1vxlz.png";

  if (imagePath) {
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: "dishes",
    });
    imageUrl = uploadResult.secure_url;
  }

  return await Dish.create({ ...dishData, dish_url: imageUrl });
};

//Update trường hợp mảng hình ảnh
// const updateDishService = async (id, dataUpdate, imagePaths) => {
//   const existingDish = await Dish.findById(id);
//   if (!existingDish) {
//     throw new Error("Dish not found");
//   }

//   let updatedImageUrls = dataUpdate.dish_url || [];
//   let existingImageUrls = existingDish.dish_url || [];

//   // Xóa các ảnh cũ nếu không có trong dữ liệu update
//   const imagesToRemove = existingImageUrls.filter(
//     (img) => !updatedImageUrls.includes(img)
//   );

//   // Nếu có ảnh mới, upload lên Cloudinary
//   if (imagePaths && imagePaths.length > 0) {
//     const uploadedUrls = await uploadMultipleImagesService(imagePaths);
//     updatedImageUrls = [...updatedImageUrls, ...uploadedUrls];
//   }

//   // Cập nhật dữ liệu món ăn
//   const updatedDish = await Dish.findByIdAndUpdate(
//     id,
//     { ...dataUpdate, dish_url: updatedImageUrls },
//     { new: true }
//   );

//   return updatedDish;
// };

//Update trường hợp 1 hình ảnh
const updateDishService = async (id, dataUpdate, imagePath) => {
  const existingDish = await Dish.findById(id);
  if (!existingDish) {
    throw new Error("Dish not found");
  }

  let imageUrl = dataUpdate.dish_url || existingDish.dish_url;

  if (imagePath) {
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: "dishes",
    });
    imageUrl = uploadResult.secure_url;
  }

  return await Dish.findByIdAndUpdate(
    id,
    { ...dataUpdate, dish_url: imageUrl },
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

const getListDishByBusinessIdService = async (businessId) => {
  try {
    const menus = await Menu.find({ business_id: businessId });
    const menuIds = menus.map((menu) => menu._id);
    const dishes = await Dish.find({ menu_id: { $in: menuIds } });
    return dishes;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getListDishService,
  getDishByIdService,
  // uploadMultipleImagesService,
  createDishService,
  updateDishService,
  deleteDishService,
  getDishesByMenuIdService,
  getListDishByBusinessIdService,
};
