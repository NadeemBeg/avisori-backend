const express = require("express");
const router = express.Router();

const {
  	getIntroData,
   createIntroData,
   createContactUs
} = require("../controllers/getIntroData");


router.get("/getIntroData", getIntroData);

router.post(
  "/introData/create",
  createIntroData
);

router.post(
  "/createContactUs",
  createContactUs
);



module.exports = router;