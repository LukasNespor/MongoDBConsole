function onLoad() {
  document.getElementById("date").value = new Date().toISOString();
  getSecondsFromEpoch();
}

function getSecondsFromEpoch() {
  var dateString = document.getElementById("date").value;
  document.getElementById("convertedDate").value = Math.round(new Date(dateString).getTime()/1000.0);
}

function executeQuery() {
  var limit = document.getElementById("limit").value;
  var collection = document.getElementById("collection").value;
  var queryString = document.getElementById("query").value;
  var projectionString = document.getElementById("projection").value;
  if (projectionString === "" || projectionString === undefined)
    projectionString = "{}";

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      var data = JSON.parse(req.responseText);
      document.getElementById("result").innerText = JSON.stringify(data, null, "  ");
      document.getElementById("count").innerText = data.length;

      hljs.initHighlighting.called = false;
      hljs.initHighlighting();
    }
  };
  req.open("POST", "/api/query", true);
  req.setRequestHeader("Content-type", "application/json");
  req.send(JSON.stringify({ 
    collection: collection,
    limit: limit,
    query: queryString,
    projection: projectionString
  }));
}
