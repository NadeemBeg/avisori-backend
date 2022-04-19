const express = require('express');
const router = express.Router();
const {verifyAuth} = require('../../middleware/auth');
const {addAdvisorType,getAllAdvisorType} = require('../../controllers/admin/advisorType');

router.post('/addAdvisorType',verifyAuth, addAdvisorType);
router.get('/getAllAdvisorType',verifyAuth, getAllAdvisorType);

module.exports = router;