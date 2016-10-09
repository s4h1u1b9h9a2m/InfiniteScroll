var express = require('express');
var router = express.Router();

var faker = require('faker');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/products', function(req, res, next) {

  var data = [];

  for(i = 0; i < 10; ++i){
    data.push({
      "name": faker.commerce.productName(),
      "price": faker.commerce.price()
    });
  }

  res.json(data);
});

module.exports = router;
