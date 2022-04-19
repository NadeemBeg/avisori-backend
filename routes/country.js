const express = require("express");
const router = express.Router();

const {
    addCountry,
    getCountry,
    addLanguage,
    getLanguages,
} = require("../controllers/country");


router.post(
  "/addCountry",
  addCountry
);
router.get(
    "/getCountry",
    getCountry
);

router.post(
  "/addLanguage",
  addLanguage
);
router.get(
  "/getLanguages",
  getLanguages
);
module.exports = router;