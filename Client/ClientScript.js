var socket = io();
var playerTable = document.getElementById('playerTable');
var gameMoment = document.getElementById('gameMoment');
var enemyTable = document.getElementById('enemyTable');
var users = document.getElementById('users');
var $userForm = $('#userForm');
var $userFormArea = $('#userFormArea');
var $username = $('#username');
var $gameArea = $('.globalCont');
var shipsPositions = [];
var readyFlag = false;
var channel = "firstChannel";

socket.on('connect', function () {
    socket.emit('joinChannel', {
        channel: channel
    });
});

$userForm.submit(function (e) {
    e.preventDefault();
    socket.emit('new user', $username.val(), function (data) {
        if (data) {
            $userFormArea.hide();
            $gameArea.show();
            alert("Rozstaw statki!");
        }
    });
    $username.val('');
});

var createShips = function (e) {
    var clickedId = e.target.getAttribute('id');
    if (shipsPositions.length === 9) {
        socket.emit('add ships', shipsPositions);
        readyFlag = true;
        socket.emit('game ready', readyFlag);
    } else {
        shipsPositions.push(clickedId);
        console.log(shipsPositions);
        e.target.setAttribute('style', "background: blue");
    }
};

var aimShips = function (e) {
    var clickedId = e.target.getAttribute('id');
    console.log(clickedId);
    e.target.setAttribute('style', "background: blue");
    socket.emit('aim', clickedId);
};

for (var i = 0; i <= 6; i++) {
    var tr = document.createElement('tr');
    //tr.setAttribute('id', i);
    for (var j = 0; j <= 6; j++) {
        var td = document.createElement('td');
        td.innerHTML = i + ' ' + j;
        var id = i + '' + j;
        td.setAttribute('id', id);
        td.setAttribute('style', "border: 1px solid black");
        tr.appendChild(td);
    }
    playerTable.appendChild(tr);
}
;

var cln = playerTable.cloneNode(true);
cln.setAttribute('id', "enemyTable");
cln.setAttribute('class', "table table-responsive enemyT")
enemyTable.appendChild(cln);

playerTable.addEventListener('click', createShips);

socket.on('get users', function (data) {
    var html = '';
    for (var i = 0; i < data.length; i++) {
        html += '<li class="list-group-item">' + data[i] + '</li>';
    }
    users.innerHTML = html;
});

socket.on('start game', function () {
    gameMoment.innerHTML = "Game started!";
    playerTable.removeEventListener('click', createShips);
    enemyTable.addEventListener('click', aimShips);
});

socket.on('checkAim', function(data){
    if (shipsPositions.indexOf(data) > -1) {
        socket.emit('hit', data);
        shipsPositions.splice(shipsPositions.indexOf(data), 1);
        var hittedTd = playerTable.querySelector("[id='"+data+"']");
        hittedTd.style = "background: red";
    } else {
        console.log("miss");
    }
});

socket.on('hit done', function(data){
    console.log("Hit Done");
    console.log(data);
    var hitDone = enemyTable.querySelector("[id='"+data+"']");
    hitDone.setAttribute('style', "background: red");
});