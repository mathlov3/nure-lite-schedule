var express = require('express');
var router = express.Router();
var nureApi = require('./../modules/nure_api');

router.get('/', async function(req, res, next) {
  var groupId = req.query.groupId;
  var fromDate = new Date(req.query.fromDate);
  var toDate = new Date(req.query.toDate);    
  res.send(JSON.stringify(await nureApi.getSchedule(groupId, fromDate, toDate)));  
});

module.exports = router;
