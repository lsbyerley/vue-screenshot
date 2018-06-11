const router = require('express').Router();
const screenshot = require('./screenshot');
const test = require('./test');

router.use(screenshot);
router.use(test);

module.exports = router
