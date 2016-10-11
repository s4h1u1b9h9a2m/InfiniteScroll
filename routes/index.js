var express = require('express');
var router = express.Router();

var faker = require('faker');

var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/products', function(req, res, next) {

  var data = [];

  for(i = 0; i < 10; ++i){
    data.push({
      "image": faker.image.image(),
      "name": faker.commerce.productName(),
      "price": faker.commerce.price(),
      "department": faker.commerce.department()
    });
  }

  res.json(data);
});

router.post('/reCaptchaCheck',function(req,res){
  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.

  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  // Put your secret key here.
  var secretKey = "6Leg5QgUAAAAAPNITWdcW0GK8SX7dwll6hJRpjtr";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify";

  console.log("1");
  request.post({url:verificationUrl, form: {'secret':secretKey, 'response': req.body['g-recaptcha-response'], 'remoteip': req.connection.remoteAddress}}, function(err,httpResponse,body){
    body = JSON.parse(body);
    console.log(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Success"});
  });

});


module.exports = router;
