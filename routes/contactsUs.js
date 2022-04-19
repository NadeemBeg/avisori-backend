const express = require('express');
const router = express.Router();
const {getContactUs} = require('../controllers/contactus');
const {verifyAuth} = require('../middleware/auth');

router.get('/getContactUs', verifyAuth, getContactUs);

module.exports = router;