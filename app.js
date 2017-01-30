var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});

app.get('/',function(req,res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server started!');

var usernames = {};
var rooms = ['Lobby'];

io.sockets.on('connection', function(socket){

    console.log('Socket connection!');

    socket.on('adduser', function(username){
        socket.username = username;
        socket.room = 'Lobby';
        usernames[username] = username;
        socket.join('Lobby');
        socket.emit('updaterooms', rooms, 'Lobby');
        console.log(usernames);
    });

    socket.on('create', function(room){
       rooms.push(room);
       socket.emit('updaterooms', rooms, socket.room);
    });
});

