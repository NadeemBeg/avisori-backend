const express = require('express');
const router = express.Router();
const {addCompany, getCompany} = require('../../controllers/admin/company');
const {addAdvisor, updateAdvisor, deleteAdvisor, getAdvisor,getAllAdvisors} = require('../../controllers/admin/advisor');
const {verifyAuth} = require('../../middleware/auth');


router.post('/addCompany',verifyAuth, addCompany);
router.get('/getCompany',verifyAuth, getCompany);
router.post('/addAdvisor',verifyAuth ,addAdvisor);
router.put('/updateAdvisor',verifyAuth ,updateAdvisor);
router.delete('/deleteAdvisor',verifyAuth ,deleteAdvisor);
router.post('/getAdvisor' ,verifyAuth, getAdvisor);
router.post('/getAllAdvisors' ,verifyAuth, getAllAdvisors);

module.exports = router;