const express = require("express");
const router = express.Router();

const {
    addAppointment,
} = require("../controllers/appointment");


router.post(
  "/addAppointment",
  addAppointment
);

module.exports = router;