var express = require('express');
var router = express.Router();
var nureApi = require('./../modules/nure_api');

router.get('/', function(req, res, next) {   
  var facultyId = req.query.facultyId;
  res.send(JSON.stringify(nureApi.getDepartments(facultyId)));  
});

module.exports = router;
