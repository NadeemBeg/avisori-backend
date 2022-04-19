const express = require("express");
const router = express.Router();

const {
    addFaqQueAns,
    listFaq
} = require("../controllers/faq");


router.post(
  "/addFaqQueAns",
  addFaqQueAns
);
router.get(
    "/listFaq",
    listFaq
)

module.exports = router;