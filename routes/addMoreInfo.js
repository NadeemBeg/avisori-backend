const express = require("express");
const router = express.Router();

const {
  addNewuser,
  getAllUser,
  changeNotification,
  listAdvisors,
  viewAdvisor,
} = require("../controllers/addMoreInfo");


router.post(
  "/addUserInfo",
  addNewuser
);

router.get(
	"/getAllUser",
	getAllUser
	);
router.post(
  "/changeNotification",
  changeNotification
);
router.post(
  "/listAdvisors",
  listAdvisors
);
router.post(
  "/viewAdvisor",
  viewAdvisor
);

module.exports = router;