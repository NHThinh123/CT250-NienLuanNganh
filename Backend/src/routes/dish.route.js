const express = require("express");
const {
  createDish,
  updateDish, 
  searchDish,
  findByIdDish,
  findAllDish,
  deleteDish,
  deleteAllDish
} = require("../controllers/dish.controller");
const router = express.Router();

router.route("/")
  .post(createDish)
  .get(findAllDish)
  .delete(deleteAllDish)

router.route("/search/:name")
  .get(searchDish)

router.route("/:id")
  .get(findByIdDish)
  .put(updateDish)
  .delete(deleteDish)


module.exports = router;