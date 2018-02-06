var express = require("express");
var router = express.Router();
var EJSON = require('mongodb-extended-json')
var MongoClient = require("mongodb").MongoClient;
var config = require("../config.json");

router.route("/query").post((req, res) => {
  if (config.connectionString === "") {
    throw new Error("Missing connection string");
  }
  
  if (config.dbName === "") {
    throw new Error("Missing database name");
  }

  MongoClient.connect(config.connectionString, function(err, mongoClient) {
    if (err) throw err;
    var db = mongoClient.db(config.dbName);
    
    var query = {};
    try { query = EJSON.parse(req.body.query); } catch(err) { console.log(err) }
    
    var projection = {};
    try { projection = EJSON.parse(req.body.projection); } catch(err) { console.log(err) }

    var cursor = db.collection(req.body.collection).find(query);
    cursor.project(projection);
    cursor.sort({ $natural: -1 });
    cursor.limit(parseInt(req.body.limit));
    cursor.toArray(function(err, result) {
      if (err) throw err;

      return res.json(result);
    });
  });
});

module.exports = router;
