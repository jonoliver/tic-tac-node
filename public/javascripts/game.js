var gameId = GetQueryVariable(window.location.search, 'id');
console.log(gameSettings);
// DOM EVENTS

$('.playagain').click(function(){
  //TODO: call to server to get new game properties
  resetBoard();
  $(this).hide();
});
// END DOM EVENTS

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
  
  $scope.isTurn = (gameSettings.playerMarker === gameSettings.currentTurn);
  $scope.notification = '';
  $scope.highlights = [];

  updateBoard(gameSettings.savedBoard);
  notifyTurn();

  $scope.play = function(i){
    if ($scope.isTurn){
      makeMove(i);
      socket.emit('play', { id: gameId, position: i });
    }
  };

  socket.on('update', function (data) {
    console.log('data', data);
    makeMove(data.position);
  });

  socket.on('gameover', function (data) {
    console.log('data', data);

    if (data.isWin) {
      $scope.highlights = data.winningSquares;
      $scope.notification = (data.lastTurn === gameSettings.playerMarker) ? 'You win!' : 'You lose!';
      
      $('.playagain').show();
    } else if (data.isTie) {
      $scope.notification = "It's a tie!";
      $('.playagain').show();
    }
  });

  socket.on('playerror', function (data) {
    console.log('error', data.error);
    resetSquare(data.position);
    $scope.isTurn = !($scope.isTurn);
    notifyTurn();
  });

  function updateBoard(board){
    for (var i=0; i < board.length; i++){
      $scope.board[i].move = board[i];
    }
  }

  function makeMove(i){
    updateSquare(i);
    $scope.highlights = [i];
    $scope.isTurn = !($scope.isTurn);
    notifyTurn();
  }

  function updateSquare(i){
    $scope.board[i].move = $scope.isTurn ? gameSettings.playerMarker : opponentMarker;
  }

  function notifyTurn() {
    var fillText = ($scope.isTurn) ? 'your' : opponentMarker + "'s";
    $scope.notification = "It's " + fillText + " turn!";
  }
  function resetSquare(i){
    delete $scope.board[i].move;
  }
}