var http = require("http");
var fs = require("fs");
var express = require("express");
var sentiment = require("sentiment");

function sentimentToSmiley(texto) {
  var score = sentiment(texto).score;

  if(score === 0) { return ':-|' }
  if(score < 0) {
    if(score > -2) { return ':-(' }
    return ':`('
  }

  if(score < 2) { return ':-)' }
  return ':-D'
}

var app = new express();

console.log("Starting");

var host = "127.0.0.1";
var port = 80;


var server = http.createServer(function(request, response){
	console.log("Received request: " + request.url);
	fs.readFile("./public" + request.url, function(error, data){
		if (error) {
			response.writeHead(404, {"Content-type":"text/plain"});
			response.end("Nope");
		} else {
			response.writeHead(200, {"Content-type":"text/html"});
			response.end(data);
		}
	});
});


server.listen(port, host, function(){
	console.log("Listening " + host + ":" + port);
});

