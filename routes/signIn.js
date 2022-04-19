const express = require("express");
const router = express.Router();

const {
    loginUser,
    getProfile,
    updateProfile,
  } = require("../controllers/signIn");
  
  router.post(
    "/login",
    loginUser
  );
  router.get(
    "/getProfile",
    getProfile
  );
  router.post(
    "/updateProfile",
    updateProfile
  );
  
  module.exports = router;