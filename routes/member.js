var express = require('express');
var csrf = require('csurf')
var router = express.Router();
var csrfProtected = csrf();
router.use(csrfProtected);

var member_controller = require('../controllers/memberController');

/* Get Profile */
router.get('/tai-khoan', member_controller.get_profile);

/* GET Member listing. */
router.get('/dang-ky', member_controller.get_register);

/* GET Member listing. */
router.post('/dang-ky', member_controller.post_register);

module.exports = router;
