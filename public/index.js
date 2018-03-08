function executeQuery() {
  var collection = document.getElementById("collection").value;
  var limit = document.getElementById("limit").value;
  var queryString = document.getElementById("query").value;
  var projectionString = document.getElementById("projection").value;

  var message = document.getElementById("message");
  if (collection === "") {
    message.innerText = "Missing collection name";
    return;
  }
  else { 
    message.innerText = "";
  }

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.status == 200) {
      var data = JSON.parse(req.responseText);
      document.getElementById("result").innerText = JSON.stringify(data, null, "  ");
      document.getElementById("count").innerText = data.length;

      hljs.initHighlighting.called = false;
      hljs.initHighlighting();
    }
    else if (req.status == 500) {
      console.log(req);
      document.getElementById("message").innerText = req.responseText;
    }
  };
  req.onerror = function(err) {
    document.getElementById("message").innerText = err;
  };
  req.open("POST", "/api/query", true);
  req.setRequestHeader("Content-type", "application/json");

  try {
    var data = JSON.stringify({ 
      collection: collection,
      limit: limit === "" ? 0 : limit,
      query: queryString === "" ? "{}" : queryString,
      projection: projectionString === "" ? "{}" : projectionString
    });
    req.send(data);
  }
  catch(err) {
    document.getElementById("message").innerText = err;    
  }
}
