var express = require('express');
var csrf = require('csurf')
var router = express.Router();
var csrfProtected = csrf();
var member_controller = require('../controllers/memberController')
router.use(csrfProtected);
/* GET Member listing. */
router.get('/dang-ky', member_controller.get_register);

/* GET Member listing. */
router.post('/dang-ky', member_controller.post_register);
module.exports = router;
