const express = require("express");
const userController = require("../controllers/userController");
const multer = require("multer");

const router = express.Router();

router.post(
  "/",
  multer().single("photo"),
  userController.createUser,
  userController.resizeUserPhoto,
  userController.loadImage
);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

module.exports = router;
