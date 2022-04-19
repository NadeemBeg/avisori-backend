const express = require("express");
const router = express.Router();

const {
    addCompany,
} = require("../controllers/company");


router.post(
  "/addCompany",
  addCompany
);

module.exports = router;