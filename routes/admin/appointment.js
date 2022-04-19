const express = require('express');
const router = express.Router();
const {verifyAuth} = require('../../middleware/auth');
const {getAppointmentAdvisor, myCases, updateNote} = require('../../controllers/admin/appointment');

router.get('/getAppointmentAdvisor',verifyAuth, getAppointmentAdvisor);
router.get('/myCases',verifyAuth, myCases);
router.put('/updateNote', verifyAuth, updateNote);

module.exports = router;