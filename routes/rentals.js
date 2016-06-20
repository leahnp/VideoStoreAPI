var express = require('express');
var router = express.Router();
var Controller = require('../controllers/rentals')

router.get('/:title', Controller.getRentals)
router.get('/:title/customers', Controller.getRentalsCustomers)
router.post('/:title/check-out/:customer_id', Controller.getRentalsCheckOut)
router.get('/:title/return', Controller.getRentalsReturn)
router.get('/overdue', Controller.getRentalsOverdue)




module.exports = router;
