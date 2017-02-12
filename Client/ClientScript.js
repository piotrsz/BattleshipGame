var socket = io();
    playerTable = document.getElementById('playerTable');
    gameMoment = document.getElementById('gameMoment');
    enemyTable = document.getElementById('enemyTable');
    users = document.getElementById('users');
    currentUser = document.getElementById('currentUser');
    $userForm = $('#userForm');
    $userFormArea = $('#userFormArea');
    $username = $('#username');
    $gameArea = $('.globalCont');
    shipsPositions = [];
    readyFlag = false;
    channel = "firstChannel";

var createShips = function (e) {
    var clickedId = e.target.getAttribute('id');
    if (shipsPositions.length === 9) {
        socket.emit('add ships', shipsPositions);
        readyFlag = true;
        socket.emit('game ready', readyFlag);
        alert('Jestes gotow! Zaczekaj na drugiego gracza');
    } else {
        if (shipsPositions.indexOf(clickedId) > -1) {
            alert("W tym miejscu jest juz statek!");
            return;
        }
        shipsPositions.push(clickedId);
        console.log(shipsPositions);
        e.target.setAttribute('style', "background: #5297d2; border: 3px solid blue; text-align: center");
    }
};

var aimShips = function (e) {
    var clickedId = e.target.getAttribute('id');
    console.log(clickedId);
    e.target.setAttribute('style', "background: blue");
    socket.emit('aim', clickedId);
};

$userForm.submit(function (e) {
    e.preventDefault();
    currentUser.innerHTML = "Twój nick: " + "</br><strong>" + $username.val() + "</strong> ";
    socket.emit('new user', $username.val(), function (data) {
        if (data) {
            $userFormArea.hide();
            $gameArea.show();
            alert("Rozstaw statki!");
        }
    });
    $username.val('');
});

for (var i = 0; i <= 6; i++) {
    var tr = document.createElement('tr');
    //tr.setAttribute('id', i);
    for (var j = 0; j <= 6; j++) {
        var td = document.createElement('td');
        var id = i + '' + j;
        td.innerHTML = id;
        td.setAttribute('id', id);
        td.setAttribute('style', "border: 1px solid black; text-align: center");
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
playerTable.setAttribute('style', "border: 3px solid blue");

socket.on('connect', function () {
    socket.emit('joinChannel', {
        channel: channel
    });
});

socket.on('get users', function (data) {
    var html = '';
    for (var i = 0; i < data.length; i++) {
        html += '<li class="list-group-item">' + data[i] + '</li>';
    }
    users.innerHTML = html;
});

socket.on('start game', function () {
    gameMoment.innerHTML = "Game started!";
    alert("start!");
    playerTable.removeEventListener('click', createShips);
    enemyTable.addEventListener('click', aimShips);
    playerTable.setAttribute('style', "border: 3px solid black");
    enemyTable.firstChild.setAttribute('style', "border: 3px solid red");
});

socket.on('checkAim', function (data) {
    if (shipsPositions.indexOf(data) > -1) {
        socket.emit('hit', data);
        shipsPositions.splice(shipsPositions.indexOf(data), 1);
        var hittedTd = playerTable.querySelector("[id='" + data + "']");
        hittedTd.style = "background: red; text-align: center";
        hittedTd.innerHTML = "HIT";
        if (shipsPositions.length === 0) {
            socket.emit('defeat');
        }
    } else {
        var missedTd = playerTable.querySelector("[id='" + data + "']");
        missedTd.style = "text-align: center";
        missedTd.innerHTML = "MISS";
        //console.log("miss");
    }
});

socket.on('hit done', function (data) {
    var hitDone = enemyTable.querySelector("[id='" + data + "']");
    hitDone.setAttribute('style', "background: red; text-align: center");
    hitDone.innerHTML = "HIT";
});

socket.on('game over', function () {
    if (shipsPositions.length > 0) {
        alert("Brawo! Wygrałeś!");
    } else {
        alert("Poniosłeś porażkę!");
    }
});