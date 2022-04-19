const express = require('express');
const router = express.Router();
const {getAllDocs} = require('../../controllers/admin/document');
const {verifyAuth} = require('../../middleware/auth');

router.get('/docs',verifyAuth,getAllDocs);

module.exports = router;