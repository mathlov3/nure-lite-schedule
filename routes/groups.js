var express = require('express');
var router = express.Router();
var nureApi = require('./../modules/nure_api');

router.get('/', function(req, res, next) {   
  var departmentId = req.query.departmentId;
  var course = req.query.course;
  res.send(JSON.stringify(nureApi.getGroups(departmentId, course)));  
});

module.exports = router;
