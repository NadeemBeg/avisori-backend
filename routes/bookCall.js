const express = require("express");
const router = express.Router();
const {getCardDetail, updateCustomerCard, makePayment} = require('../middleware/stripe');
const {
    addBookCall,
    myCases,
    startCall,
    endCall,
    viewCase,
    addFeedback,
} = require("../controllers/bookCall");


router.post(
  "/addBookCall",
  getCardDetail,
  updateCustomerCard,
  makePayment,
  addBookCall
);
router.get(
  "/myCases",
  myCases
);

router.post(
  "/startCall",
  startCall
);
router.post(
  "/endCall",
  endCall
);
router.post(
  "/viewCase",
  viewCase
);
router.post(
  "/addFeedback",
  addFeedback
);
module.exports = router;