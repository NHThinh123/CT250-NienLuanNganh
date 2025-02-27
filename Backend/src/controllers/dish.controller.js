const Menu = require("../models/menu.model");
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

// const createDish = async (req, res, next) => {
//   try {
//     const dishData = req.body;
//     const data = await createDishService(dishData);
//     res.status(201).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

const createDish = async (req, res) => {
  try {
    const dishData = req.body;
    const imagePaths = req.files?.map((file) => file.path) || []; // Lấy danh sách đường dẫn ảnh

    const newDish = await createDishService(dishData, imagePaths);

    // Lấy business_id từ menu_id
    const menu = await Menu.findById(dishData.menu_id);
    if (menu) {
      await updateDishCostBusinessService(menu.business_id); // Cập nhật giá món thấp nhất và cao nhất
    }

    res.status(201).json({ success: true, data: newDish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const updateDish = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const dataUpdate = req.body;
//     const data = await updateDishService(id, dataUpdate);
//     res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    const imagePaths = req.files?.map((file) => file.path) || [];

    const updatedDish = await updateDishService(id, dataUpdate, imagePaths);
    console.log(updateDish);

    // Lấy business_id từ menu_id
    if (dataUpdate.dish_price !== undefined) {
      const menu = await Menu.findById(updateDish.menu_id);
      if (menu) {
        await updateDishCostBusinessService(menu.business_id); // Cập nhật giá món thấp nhất và cao nhất
      }
    }

    res.json({ success: true, data: updatedDish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deleteDishService(id);

    // Lấy business_id từ menu_id
    const menu = await Menu.findById(dishData.menu_id);
    if (menu) {
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
