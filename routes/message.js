const express = require("express");
const router = express.Router();

const {
    addMessage,
    messageList,
    deleteMsg,
    replyMessage,
} = require("../controllers/message");

router.post(
  "/addMessage",
  addMessage
);
router.get(
  "/messageList",
  messageList
);
router.post(
  "/deleteMessage",
  deleteMsg
);
router.post(
  "/replyMessage",
  replyMessage
);
module.exports = router;