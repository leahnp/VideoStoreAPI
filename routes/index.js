var express = require('express');
var router = express.Router();
// var Controller = require('../controllers/scrabble')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({index: 'index'})
});

router.get('/zomg', function(req, res, next) {
  res.status(200).json({whatevs: 'it works!!!!'})
});

module.exports = router;