const express = require("express");
const router = express.Router();

const {
    addCard,
    getCards,
    editCard,
    deleteCard,
    setDefaultCard
} = require("../controllers/cardDetail");
const {verifyAuth} = require('../middleware/auth');


router.post(
  "/addCard",
  addCard
);
router.get(
  "/getCards",
  getCards
);
router.post(
  "/editCard",
  editCard
);
router.post(
  "/deleteCard",
  deleteCard
);
router.put('/setDefaultCard',verifyAuth, setDefaultCard);


module.exports = router;