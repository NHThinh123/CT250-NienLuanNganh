const {
  getListDishService,
  createDishService,
  getDishByIdService,
  updateDishService,
  deleteDishService,
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

    res.json({ success: true, data: updatedDish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deleteDishService(id);
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
};
