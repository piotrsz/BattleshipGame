var socket = io();
var playerTable = document.getElementById('playerTable');
var enemyTable = document.getElementById('enemyTable');
var users = document.getElementById('users');
var $userForm = $('#userForm');
var $userFormArea = $('#userFormArea');
var $username = $('#username');
var $gameArea = $('.globalCont');
var shipsPositions = [];
var readyFlag = false;
var channel = "firstChannel";

var createShips = function(e) {
    var clickedId = e.target.getAttribute('id') + e.target.parentNode.getAttribute('id');
    if (shipsPositions.length >= 9) {
        socket.emit('add ships', shipsPositions);
        console.log("SHIPS SENT");
        readyFlag = true;
        socket.emit('game ready', readyFlag);
        console.log("READY SENT");
    } else {
        shipsPositions.push(clickedId);
        console.log(shipsPositions);
        e.target.setAttribute('style', "background: blue");
    }
};

for (var i=0; i <= 6; i++){
    var tr = document.createElement('tr');
    tr.setAttribute('id', i);
    for (var j=0; j<= 6; j++){
        var td = document.createElement('td');
        td.innerHTML = i + ' ' + j;
        td.setAttribute('id', j);
        td.setAttribute('style', "border: 1px solid black");
        tr.appendChild(td);
    }
    playerTable.appendChild(tr);
};

var cln = playerTable.cloneNode(true);
enemyTable.appendChild(cln);

playerTable.addEventListener('click', createShips);

$userForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user', $username.val(), function(data){
        if (data) {
            $userFormArea.hide();
            $gameArea.show();
            alert("Rozstaw statki!");
        }
    });
    $username.val('');
});

socket.on('get users', function(data){
    var html = '';
    for(var i = 0; i < data.length; i++) {
        html += '<li class="list-group-item">' + data[i] + '</li>';
    }
    users.innerHTML = html;
});

socket.on('connect', function(){
    socket.emit('joinChannel', {
        channel: channel
    });
});

socket.on('Start game', function(){
    var gameMoment = document.getElementById('gameMoment');
    
})