const WebSocketServer = require("ws").Server;
const express = require("express");
const http = require("http");
const msgpack = require("msgpack-lite");

var app = express();
app.use(express.static("public"));

var server = http.createServer(app);
server.listen(8082);

var wss = new WebSocketServer({
  server: server, 
  path: "/ws"
});

wss.on("connection", function(ws) {
  ws.binaryType = "arraybuffer";
  console.log("connected.");

  ws.on("message", function(data) {
  });

  ws.on("close", function() {
    console.log("disconnected.");
  });
})

wss.on("close", function(ws) {
  console.log("closed.");
});
