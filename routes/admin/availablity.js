const express = require('express');
const router = express.Router();
const {verifyAuth} = require('../../middleware/auth');
const {getAvailability, addAvailability} = require('../../controllers/admin/availablity');

router.post('/getAvailability', verifyAuth, getAvailability);
router.post('/addAvailability', verifyAuth, addAvailability);

module.exports = router;