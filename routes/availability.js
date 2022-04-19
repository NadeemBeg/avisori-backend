const express = require("express");
const router = express.Router();

const {
    addAvailability,
    getAvailability,
    getAvailableTimeSlot,
    getUpcommingAppointmentAdvisor,
    listMyAdvisors,
} = require("../controllers/availability");


router.post(
  "/addAvailability",
  addAvailability
);
router.post(
  "/getAvailability",
  getAvailability
);
router.post(
  "/getAvailableTimeSlot",
  getAvailableTimeSlot
);
router.get(
  "/getUpcommingAppointmentAdvisor",
  getUpcommingAppointmentAdvisor
);
router.get(
  "/listMyAdvisors",
  listMyAdvisors
);
module.exports = router;