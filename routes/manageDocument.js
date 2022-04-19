const express = require("express");
const router = express.Router();

const {
    addDocument,
} = require("../controllers/manageDocument");


router.post("/addDocument", addDocument);

module.exports = router;