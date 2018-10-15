var express = require('express');
var router = express.Router();
var nureApi = require('./../modules/nure_api');

router.get('/', function(req, res, next) {   
  res.send(JSON.stringify(nureApi.getFaculties()));  
});

module.exports = router;
