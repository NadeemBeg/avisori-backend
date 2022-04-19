const express = require("express");
const router = express.Router();

const {
    getHomeData,
    contactUs,
} = require("../controllers/home");


router.get("/getHomeData", getHomeData);
router.post("/contactUs",contactUs);

module.exports = router;