const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getDocuments,
} = require("../controllers/uploadDocument");

router.post(
  "/uploadDocument",
  uploadDocument
);

module.exports = router;