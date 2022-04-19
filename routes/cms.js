const express = require("express");
const router = express.Router();

const {
    addCms,
} = require("../controllers/cms");

router.post(
  "/addCms",
  addCms
);

module.exports = router;