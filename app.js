var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});
var users = [];
var connections = [];
var shipsPositions = [];

app.get('/',function(req,res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server running..');

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length)

    //Disconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets left.', connections.length);
    });

    //New user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    //Ships positions
    socket.on('add ships', function(data){
        socket.ships = data;
        shipsPositions.push(socket.ships);
        console.log("Ships position recieved: %s", shipsPositions);
    });


});

function updateUsernames(){
    io.sockets.emit('get users', users);
};