var socket = io();
var playerTable = document.getElementById('playerTable');
var enemyTable = document.getElementById('enemyTable');
var users = document.getElementById('users');
var $userForm = $('#userForm');
var $userFormArea = $('#userFormArea');
var $username = $('#username');
var $gameArea = $('.globalCont');
var shipsPositions = [];

var createOnClickHandler = function(e) {
    var clickedId = e.target.getAttribute('id');
    if (shipsPositions.length >= 9) {
        return
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
        td.addEventListener('click', createOnClickHandler);
        tr.appendChild(td);
    }
    playerTable.appendChild(tr);
};

var cln = playerTable.cloneNode(true);
enemyTable.appendChild(cln);

$userForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user', $username.val(), function(data){
        if (data) {
            $userFormArea.hide();
            $gameArea.show();
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

//makeShips();


function makeShips(){
    prompt('Rozstaw swoje statki!');
    socket.emit('add ships', shipsPositions);
}

