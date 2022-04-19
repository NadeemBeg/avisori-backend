const express = require("express");
const router = express.Router();

const {
    addCategory,
    addSubCategory,
    listSubCategory,
    listLanguagesByServices,
} = require("../controllers/category");


router.post(
  "/addCategory",
  addCategory
);
router.post(
    "/addSubCategory",
    addSubCategory
);
router.post(
    "/listSubCategory",
    listSubCategory
);
router.post(
    "/listLanguagesByServices",
    listLanguagesByServices
);

module.exports = router;