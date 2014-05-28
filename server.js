var express = require("express");
var app = express();
var port = 8888;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
    res.render("page");
});

app.use(express.static(__dirname + '/public')); 

var io = require('socket.io').listen(app.listen(port));
var playerarray = [];
var index = 0;

function dataobject(dex, clientid) {
	this.index = dex;
	this.id = clientid;
}

io.sockets.on('connection', function (socket) {
	socket.on('newplayer', function (data) {
		socket.emit('playerdata', new dataobject(index, socket.id));
		playerarray[index] = data;
		index += 1;
		io.sockets.emit('clientarray', playerarray);
	});
	socket.on('arrayserver', function (data) {
		playerarray[data.index] = data;
		io.sockets.emit('clientarray', playerarray);
	});
	socket.on('disconnect', function () {
    	console.log("Client " + socket.id + " disconnected.");
    	for (var i=0; i<playerarray.length; i++) {
    		if (playerarray[i].id == socket.id) {
    			console.log("detected");
    			if (i == 0) {
					playerarray.splice(0,1);
					console.log(playerarray.length);
					for (var x=0; x<playerarray.length; x++) {
						playerarray[x].index -= 1;
					}
					index -= 1;
    				io.sockets.emit('indexupdate', playerarray);
				}
				else {
					playerarray.splice(i,i);
					console.log(playerarray.length);
					for (var x=i; x<playerarray.length; x++) {
						playerarray[x].index -= 1;
					}
					index -= 1;
    				io.sockets.emit('indexupdate', playerarray);
				}
    		}
    	}
    });
});

console.log("Listening on port " + port);