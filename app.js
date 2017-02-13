var PORT = 2000;

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});
var _ = require('lodash');


var usersList = [];
var connections = [];
var users = {};
var readyChecker = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(PORT);
console.log('Server running on port ' + PORT);

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Empty channel property
    socket.channel = "";

    //Disconnect
    socket.on('disconnect', function (data) {
        usersList.splice(usersList.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets left.', connections.length);
    });

    //New user
    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        usersList.push(socket.username);
        users[socket.username] = socket;
        updateUsernames();
    });

    //Channel management
    socket.on('joinChannel', function (data) {
        socket.channel = data.channel;
    });

    //Ships positions
    socket.on('add ships', function (data) {
        socket.ships = data;
        console.log("Ships position recieved: %s", data);
    });

    //Game ready flag
    socket.on('game ready', function (data) {
        socket.ready = data;
        readyChecker[socket.username] = socket.ready;
        if (Object.keys(readyChecker).length === 2 && isPropTrue(readyChecker) === true) {
            console.log("both players are ready");
            io.emit('start game');
        } else {
            console.log("not ready");
        }
    });

    //Aim coming from player
    socket.on('aim', function(data) {
        socket.broadcast.emit('checkAim', data);
    });

    //Hit coming from second player
    socket.on('hit', function(data){
       socket.ships.splice(socket.ships.indexOf(data), 1);
       console.log(socket.ships);
       socket.broadcast.emit('hit done', data);
       console.log("hit done");
    });

    //End of a game
    socket.on('defeat', function(){
        io.emit('game over');
    })
});

function updateUsernames() {
    io.sockets.emit('get users', usersList);
}

function isPropTrue(obj) {
    for (var prop in obj) {
        if (!obj[prop] === true) {
            return false;
        }
        else {
            return true;
        }
    }
}