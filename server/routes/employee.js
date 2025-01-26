var express = require('express');
const { getEmployees } = require('../controller/employeeController');
var router = express.Router();

/* employees. */
/*GET */
router.route('/').get(getEmployees);

module.exports = router;