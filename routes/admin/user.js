const express = require('express');
const router = express.Router();
const {getProfile,updateProfile} = require('../../controllers/admin/user');
const {verifyAuth} = require('../../middleware/auth');

router.get('/getProfile',verifyAuth, getProfile);
router.put('/updateProfile',verifyAuth, updateProfile);

module.exports = router;