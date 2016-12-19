const express = require("express");
const http = require("http");
const basicAuth = require("basic-auth-connect");
const ec = require("./ec");
const sz = require("./sz");

const port = 8083;

var app = express();
app.use(basicAuth("ecp", "codar"));
app.use(express.static("public"));

var server = http.createServer(app);
server.listen(port);

app.get("/ec", function(req, res, next) {
  res.writeHead(200, {"context-type": "application/json"});
  var results = ec.execute();
  res.end(JSON.stringify(results));
});

