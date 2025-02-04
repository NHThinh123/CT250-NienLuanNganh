const {
  createDishService,
  updateDishService,
  searchDishService,
  findByIdDishService,
  findAllDishService,
  deleteDishService,
  deleteAllDishService
} = require("../services/dish.service");

const AppError = require("../utils/AppError");


//Tạo một món ăn
const createDish = async (req, res, next) => {
  try {
    const { dish_name, dish_description, dish_price, dish_url} = req.body;
    const data = await createDishService(dish_name, dish_description, dish_price, dish_url);
    res.status(200).json(data);
  } catch (error) {
    return next(
      new AppError(500, "Lỗi! Không thể tạo món ăn")
    );
  }
};

//Cập nhật thông tin món
const updateDish = async (req, res, next) => {
  try {
    const updateData = req.body;
    const data = await updateDishService(req.params.id, updateData);
    if (!data) {
      return next(new AppError(404, "Tài nguyên không tìm thấy"));
    }
    res.status(200).json(data);
  } catch (error) {
    return next(
      new AppError(500, "Lỗi! Không thể cập nhật thông tin món ăn")
    );
  }
};

//Tìm món theo tên món
const searchDish = async (req, res, next) => {
  try {
    const data = await searchDishService(req.params.name);
    res.status(200).json(data);
  } catch (error) {
    return next(
      new AppError(500, "Lỗi! Không thể tìm món ăn")
    );
  }
};

//Tìm món theo id món
const findByIdDish = async (req, res, next) => {
  try {
    const data = await findByIdDishService(req.params.id);
    if (!data) {
      return next(new AppError(404, "Tài nguyên không tìm thấy"));
    }
    res.status(200).json(data);
  } catch (error) {
    return next(
      new AppError(500, "Lỗi! Không thể tìm món ăn")
    );
  }
};

//Tìm tất cả món
const findAllDish = async (req, res, next) => {
  try {
    const data = await findAllDishService();
    res.status(200).json(data);
  } catch (error) {
    return next(
      new AppError(500, "Lỗi! Không thể tìm món ăn")
    );
  }
};

//Xóa một món theo id
const deleteDish = async (req, res, next) => {
  try {
    const data = await deleteDishService(req.params.id);
    if (!data) {
      return next(new AppError(404, "Tài nguyên không tìm thấy"));
    }
    res.status(200).send({ message: "Đã xóa thành công"});
  } catch (error) {
    return next(
      new AppError(500, "Lỗi! Không thể xóa món ăn")
    );
  }
}

//Xóa tất cả
const deleteAllDish = async (req, res, next) => {
  try {
    const data = await deleteAllDishService();
    res.status(200).send({ message: "Đã xóa thành công tất cả món ăn"});
  } catch (error) {
    return next(
      new AppError(500, "Lỗi! Không thể xóa tất cả món ăn")
    );
  }
}


module.exports = { createDish, updateDish, searchDish, findByIdDish, findAllDish, deleteDish, deleteAllDish };