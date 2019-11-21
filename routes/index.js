var express = require('express');
var router = express.Router();
var homeController = require('../controllers/homeController');

/* GET English language. */
router.get('/en', homeController.lang_en);

/* GET Vietnamese language. */
router.get('/vi', homeController.lang_vi);

/* GET home page. */
router.get('/', homeController.index);

module.exports = router;
