var express = require("express");
var app = express();
var port = 8888;

app.get("/", function(req, res){
    res.sendFile(__dirname + '/public/game.html');
});

app.use(express.static(__dirname + '/public')); 

var io = require('socket.io').listen(app.listen(process.env.PORT || port));

io.sockets.on('connection', function (socket) {
	
});

console.log("Listening on port " + port);