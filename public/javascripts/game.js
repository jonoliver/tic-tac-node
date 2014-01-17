var gameId = GetQueryVariable(window.location.search, 'id');
//var socket = io.connect('?id=' + gameId);

initPageView(gameSettings);
/*
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
    $('.notifier').html("It's a tie!");
    $('.playagain').show();
  }
});

socket.on('error', function (data) {
  console.log('error', data.error);
  resetSquare(data.position);
});
*/
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
  //updateTurn(gameSettings.currentTurn);

  //$('.notifier').show();
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
// angular
var app = angular.module('app', []);

app.factory('socket', function ($rootScope) {
  var socket = io.connect('?id=' + gameId);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

function gameCtrl($scope, socket){
  
  var opponentMarker = (gameSettings.playerMarker === "X") ? "O" : "X"; // sketchy, fix

  $scope.board = [
    { css: 'top left'},
    { css: 'top'},
    { css: 'top right'},
    { css: 'left'},
    { css: 'center'},
    { css: 'right'},
    { css: 'bottom left'},
    { css: 'bottom'},
    { css: 'bottom right'}
  ];
  
  $scope.isTurn = true;
  $scope.notification = '';

  $scope.play = function(i){
    if ($scope.isTurn){
      makeMove(i);
      socket.emit('play', { id: gameId, position: i });
    }
  };

  socket.on('update', function (data) {
    console.log('data', data);
    makeMove(data.position);

    if (data.isWin) {
      highlightSquares(data.winningSquares);
      var notification = (data.lastTurn === gameSettings.playerMarker) ? 'You win!' : 'You lose!';
      $('.notifier').html(notification);
      $('.playagain').show();
    } else if (data.isTie) {
      $('.notifier').html("It's a tie!");
      $('.playagain').show();
    }
  });

  function updateBoard(board){
    for (var i=0; i < board.length; i++){
      updateSquare(i);
    }
  }

  function makeMove(i){
      $scope.isTurn = !($scope.isTurn);
      updateSquare(i);
      notifyTurn();
  }

  function updateSquare(i){
    $scope.board[i].move = $scope.isTurn ? gameSettings.playerMarker : opponentMarker;
  }

  function notifyTurn() {
    var fillText = ($scope.isTurn) ? 'your' : opponentMarker + "'s";
    $scope.notification = "It's " + fillText + " turn!";
  }
}
/*
function gameCtrl($scope, socket){
  $scope.info = 0;
  $scope.testclick = testFunk;


  function testFunk(){
    $scope.info++;
    socket.emit('play', { id: gameId, position: 1 });
  }

  testFunk();
  $scope.testclick();
}*/