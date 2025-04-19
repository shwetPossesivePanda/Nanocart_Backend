const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  uploadTBYBImage,
  getTBYBImages,
} = require("../../controllers/userTBYBController/userTBYB");

const { verifyToken } = require("../../middlewares/verifyToken");

// POST route to upload TBYB image
router.post("/upload", verifyToken, upload.single("image"), uploadTBYBImage);

// GET route to fetch uploaded TBYB images for a user
router.get("/", authenticateUser, getTBYBImages);

module.exports = router;
