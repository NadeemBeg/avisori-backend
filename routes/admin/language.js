const express = require('express');
const router = express.Router();
const {getLanguages} = require('../../controllers/admin/language');
const {verifyAuth} = require('../../middleware/auth');

router.get('/getLanguages', verifyAuth, getLanguages);

module.exports = router;