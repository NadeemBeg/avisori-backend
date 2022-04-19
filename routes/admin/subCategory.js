const express = require('express');
const router = express.Router();
const {getSubCategory} = require('../../controllers/admin/subcategories');
const {verifyAuth} = require('../../middleware/auth');

router.get('/getSubCategory', verifyAuth, getSubCategory);

module.exports = router;