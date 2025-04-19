const express = require("express");
const router = express.Router();
const filterController = require("../../controllers/filterController/filterController");

router.post("/filters", filterController.createFilter);
router.get("/filters", filterController.getAllFilters);
router.get("/filters/:id", filterController.getFilterById);
router.put("/filters/:id", filterController.updateFilter);
router.delete("/filters/:id", filterController.deleteFilter);

module.exports = router;
