var express = require('express');
var router = express.Router();
var Controller = require('../controllers/rentals')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.status(200).json({whatevs: 'whatevs!!!'})
// });

router.get('/rentals', Controller.getRentals)

module.exports = router;
