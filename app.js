var http = require("http");
var fs = require("fs");
var express = require("express");
var sentiment = require("sentiment");

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


var io = require('socket.io').listen(8079);

io.sockets.on('connection', function (socket) {
  socket.emit('news', "Conectado");
  socket.on('analizar', function (data) {
  	mensajes = [];
  	score = [];
  	for (i in data) {
  		mensajes[mensajes.length] = data[i];
  		//score.push(Math.round(Math.random()*20-10));
  		var sco = 0;
  		sentiment(data[i], function (err, result) {
            sco = result.score;
        });
  		//console.log(data[i], sco);
  		score[score.length] = sco;
  	};
  	//console.log(mensajes, score);
    socket.emit('devolverDatos', {mensajes: mensajes, score: score});
  });
});
