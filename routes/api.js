var express = require("express");
var router = express.Router();
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
    try { query = JSON.parse(req.body.query, JSON.dateParser); } catch(err) { console.log(err) }
    
    var projection = {};
    try { projection = JSON.parse(req.body.projection); } catch(err) { console.log(err) }

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


// https://stackoverflow.com/a/23691273/4584612
if (JSON && !JSON.dateParser) {
  var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
  var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

  JSON.dateParser = function (key, value) {
      // first, just make sure the property is a string:
      if (typeof value === 'string') {
          // then, use regex to see if it's an ISO-formatted string
          var a = reISO.exec(value);
          if (a) {
              // if so, Date() can parse it:
              return new Date(value);
          }
          // otherwise, see if it's a wacky Microsoft-format string:
          a = reMsAjax.exec(value);
          if (a) {
              // and perform some jujitsu to make use of it:
              var b = a[1].split(/[-+,.]/);
              return new Date(b[0] ? +b[0] : 0 - +b[1]);
          }
          // here, you could insert any additional tests and parse instructions you like, for other date syntaxes...
      }
      // important: you need to return any values you're not parsing, or they die...
      return value;
  };
}

module.exports = router;
