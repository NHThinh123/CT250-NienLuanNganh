const Menu = require("../models/menu.model");

const {
  updateDishCostBusinessService,
  getBusinessByIdService,
} = require("../services/business.service");

const {
  getListDishService,
  createDishService,
  getDishByIdService,
  updateDishService,
  deleteDishService,
  getDishesByMenuIdService,
  getListDishByBusinessIdService,
} = require("../services/dish.service");

const getListDish = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const data = await getListDishService(Number(page), Number(limit), search);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getDishById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getDishByIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

//Tạo món trường hợp 1 hình ảnh
const createDish = async (req, res) => {
  try {
    const dishData = req.body;
    const imagePath = req.file?.path || "";

    const newDish = await createDishService(dishData, imagePath);

    const menu = await Menu.findById(dishData.menu_id);
    const business = await getBusinessByIdService(menu.business_id);

    const dish_price_created = newDish.dish_price;
    const dish_highest_cost = business.dish_highest_cost;
    const dish_lowest_cost = business.dish_lowest_cost;

    if (
      dish_price_created < dish_lowest_cost ||
      dish_price_created > dish_highest_cost
    ) {
      await updateDishCostBusinessService(menu.business_id); // Cập nhật giá món thấp nhất và cao nhất
    }

    res.status(201).json({ success: true, data: newDish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update trường hợp mảng hình ảnh
// const updateDish = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const dataUpdate = req.body;
//     const imagePaths = req.files?.map((file) => file.path) || [];

//     const updatedDish = await updateDishService(id, dataUpdate, imagePaths);
//     const menu = await Menu.findById(updatedDish.menu_id);
//     const business = await getBusinessByIdService(menu.business_id);

//     const dish_price_updated = updatedDish.dish_price;
//     const dish_highest_cost = business.dish_highest_cost;
//     const dish_lowest_cost = business.dish_lowest_cost;

//     if (
//       dish_price_updated < dish_lowest_cost ||
//       dish_price_updated > dish_highest_cost
//     ) {
//       await updateDishCostBusinessService(menu.business_id);
//     }

//     res.json({ success: true, data: updatedDish });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

//Update trường hợp 1 hình ảnh
const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    const imagePath = req.file?.path || "";

    // Lấy thông tin món ăn cũ trước khi cập nhật
    const oldDish = await getDishByIdService(id);
    const dish_price_old = oldDish.dish_price;

    const updatedDish = await updateDishService(id, dataUpdate, imagePath);

    const menu = await Menu.findById(updatedDish.menu_id);
    const business = await getBusinessByIdService(menu.business_id);

    const dish_price_updated = updatedDish.dish_price;
    const dish_highest_cost = business.dish_highest_cost;
    const dish_lowest_cost = business.dish_lowest_cost;

    if (
      dish_price_old === dish_highest_cost ||
      dish_price_updated < dish_lowest_cost ||
      dish_price_updated > dish_highest_cost
    ) {
      await updateDishCostBusinessService(menu.business_id); // Cập nhật giá món thấp nhất và cao nhất
    }

    res.json({ success: true, data: updatedDish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dish = await getDishByIdService(id);
    const data = await deleteDishService(id);

    const menu = await Menu.findById(dish.menu_id);
    const business = await getBusinessByIdService(menu.business_id);

    const dish_price_deleted = dish.dish_price;
    const dish_highest_cost = business.dish_highest_cost;
    const dish_lowest_cost = business.dish_lowest_cost;

    if (
      dish_price_deleted == dish_lowest_cost ||
      dish_price_deleted == dish_highest_cost
    ) {
      await updateDishCostBusinessService(menu.business_id); // Cập nhật giá món thấp nhất và cao nhất
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getDishesByMenuId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getDishesByMenuIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getListDishByBusinessId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getListDishByBusinessIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListDish,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  getDishesByMenuId,
  getListDishByBusinessId,
};
