var gameId = GetQueryVariable(window.location.search, 'id');
console.log('gameId');
console.log(gameId);
var socket = io.connect('http://localhost:3000?id=' + gameId);

socket.on('update', function (data) {
	console.log('data', data);
	updateSquare(data.turn, data.position);
	$(".cell").removeClass('locked');
	
	if (data.isWin) {
		alert((data.turn === playerMarker) ? 'You win!' : 'You lose!');
	} else if (data.isTie) {
		alert("It's a tie!");
	}
});

socket.on('error', function (data) {
	console.log('error', data.error);
	resetSquare(data.position);
});

updateBoard(savedBoard);

// parses the query string provided and returns the value
function GetQueryVariable(query, name) {
    if (query.indexOf("?") === 0) { query = query.substr(1); }
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        if (pair[0] == name) {
            return pair[1];
        }
    }
    return "";
}

var board = new Board();

$(".cell").click(function(){
	if (!$(this).hasClass('locked') && $(this).find(".move").size() === 0) {
		$(".cell").addClass('locked');
		var square = parseInt($(this).attr("id").split("-")[1]);
		updateSquare(playerMarker, square);
		socket.emit('play', { id: gameId, position: square });
	}
});

function updateSquare(player, position) {
		var html = '<span class="move highlight">' + player + "</span>";
		$(".move").removeClass("highlight");
		$('#cell-' + position).html(html);
}

function resetSquare(position) {
	$('#cell-' + position).html('');
}

function updateBoard(board, position) {
	for (var i=0; i < board.length; i++){
		if (board[i]) {
			var highlight =  (i === position) ? ' highlight' : '';
			var html = '<span class="move' + highlight + '">'+ board[i] + '</span>';
			$('#cell-' + i).html(html);
		}
	}
}

/*
$(".cell").click(function(){
	if ($(this).find(".move").size() === 0) {
		var square = parseInt($(this).attr("id").split("-")[1]);
		var html = '<span class="move highlight">' + currentPlayer + "</span>";
		$(".move").removeClass("highlight");
		$(this).html(html);
		socket.emit('play', { id: gameId, position: square });
		board.setSquare(square, currentPlayer);
		if (board.isWin(currentPlayer)){
			displayEndGame(currentPlayer);
		}
		else if (board.isCatsGame()){
			displayEndGame();	
		}
		else {
			changePlayer();	
		}
	}
});
*/
function displayEndGame(player){
	var message = (typeof player === "undefined") ? "Cat's game!" : player + " wins!";

	var playAgain = confirm(message + " Play again?");
	if (playAgain){
		board.setBoard([]);
		currentPlayer = "X";
		$(".cell").html("");
	}
}

function changePlayer(){
	currentPlayer = (currentPlayer === "X") ? "O" : "X";
}