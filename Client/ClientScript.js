var playerTable = document.getElementById('playerT');

for (var i=0; i <= 6; i++){
    var tr = document.createElement('tr');
    tr.setAttribute('id', i);
    for (var j=0; j<= 6; j++){
        var td = document.createElement('td');
        td.innerHTML = i + ' ' + j;
        td.setAttribute('id', j);
        tr.appendChild(td);
    }
    playerTable.appendChild(tr);
};

var enemyTable = document.getElementById('enemyT');
var cln = playerTable.cloneNode(true);
enemyTable.appendChild(cln);

var socket = io();
/*
socket.on('connect', function(){
    socket.emit('adduser', prompt("What's your username: "));
});
    */