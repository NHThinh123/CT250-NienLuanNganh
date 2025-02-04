const {
  getListMenuService,
  createMenuService,
  getMenuByIdService,
  updateMenuService,
  deleteMenuService,
} = require("../services/menu.service");

const getListMenu = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const data = await getListMenuService(Number(page), Number(limit), search);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getMenuByIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createMenu = async (req, res, next) => {
  try {
    const { menu_name } = req.body;
    const data = await createMenuService(menu_name);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    const data = await updateMenuService(id, dataUpdate);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deleteMenuService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};
