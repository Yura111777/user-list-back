const express = require("express");
const positionController = require("../controllers/positionController");
const multer = require("multer");

const router = express.Router();


router.get("/", positionController.getPositions);


module.exports = router;
