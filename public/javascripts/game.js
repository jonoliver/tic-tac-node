var gameId = GetQueryVariable(window.location.search, 'id');
var socket = io.connect('?id=' + gameId);

initPageView(gameSettings);

socket.on('update', function (data) {
  console.log('data', data);
  updateSquare(data.lastTurn, data.position);
  updateTurn(data.currentTurn);
  $(".cell").removeClass('locked');

  if (data.isWin) {
    highlightSquares(data.winningSquares);
    var notification = (data.lastTurn === gameSettings.playerMarker) ? 'You win!' : 'You lose!';
    $('.notifier').html(notification);
    $('.playagain').show();
  } else if (data.isTie) {
    alert("It's a tie!");
  }
});

socket.on('error', function (data) {
  console.log('error', data.error);
  resetSquare(data.position);
});
// DOM EVENTS
$(".cell").click(function () {
  if (!$(this).hasClass('locked') && $(this).find(".move").size() === 0) {
    $(".cell").addClass('locked');
    var square = parseInt($(this).attr("id").split("-")[1]);
    updateSquare(gameSettings.playerMarker, square);
    //TODO: fix how updateTurn is invoked with argument
    updateTurn((gameSettings.playerMarker === 'X') ? 'O' : 'X');
    socket.emit('play', { id: gameId, position: square });
  }
});

$('.playagain').click(function(){
  //TODO: call to server to get new game properties
  resetBoard();
  $(this).hide();
});
// END DOM EVENTS
function initPageView(gameSettings){
  updateBoard(gameSettings.savedBoard);
  updateTurn(gameSettings.currentTurn);

  $('.notifier').show();
}

function updateTurn(turn) {
  var fillText = (turn === gameSettings.playerMarker) ? 'your' : turn + "'s";
  $('.notifier').text("It's " + fillText + " turn!");
}

function updateSquare(player, position) {
  var html = '<span class="move highlight">' + player + "</span>";
  $(".move").removeClass("highlight");
  $('#cell-' + position).html(html);
}

function resetSquare(position) {
  $('#cell-' + position).html('');
}

function resetBoard() {
  $('.cell').html('')
        .removeClass('locked');
}

function highlightSquares(squares) {
  for (var i = 0; i < squares.length; i++) {
    $('#cell-' + squares[i]).find('.move').addClass('highlight');
  }
}

function updateBoard(board, position) {
  for (var i = 0; i < board.length; i++) {
    if (board[i]) {
      var highlight = (i === position) ? ' highlight' : '';
      var html = '<span class="move' + highlight + '">' + board[i] + '</span>';
      $('#cell-' + i).html(html);
    }
  }
}

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