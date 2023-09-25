const express = require("express");

const router = express.Router();

const {
  getSpecificUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resizeImage,
  uploadUserImage,
} = require("../Controllers/userController");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../Utils/Validators/userValidator");

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getSpecificUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
