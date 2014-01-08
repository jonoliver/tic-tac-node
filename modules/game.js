var uid = require('uid2');

var games = {};

var Game = function (gameId) {
  var id = gameId || uid(10);
  var players = [];
  var board = [];
  var turn = "X";

  function authenticate(playerId) {
    var returnData = { success: false, board: board };

    if (hasPlayer(playerId)) {
      console.log('player has already joined game %s', id);
      returnData.success = true;
      returnData.player = players[playerId];
      return returnData;
    }

    var numPlayers = Object.keys(players).length;

    if (numPlayers >= 2) {
      console.log('already 2 players, cannot join game %s', id);
      returnData.error = 'already 2 players, cannot join game';
      return returnData;
    }

    var player = {
      // first player to join is X
      marker: (numPlayers === 0) ? "X" : "O",
      wins: 0
    };

    players[playerId] = player;
    console.log('Player %s successfully joined game %s', playerId, id);
    returnData.success = true;
    returnData.player = player;
    return returnData;
  }

  function play(playerId, position) {

    var lastTurn = turn, newTurn;

    if (!hasPlayer(playerId)) {
      return { error: 'Player is not in game' };
    }

    var player = players[playerId];

    if (player.marker !== turn) {
      return { error: "Not this player's turn" };
    }

    if (board[position] !== undefined) {
      return { error: "Square is already taken" };
    }

    board[position] = player.marker;
    var winCalculation = calculateWin(player.marker);
    var win = winCalculation.isWin;
    var tie = (win) ? false : isTie();

    if (win || tie) {
      resetBoard();
    } else {
      newTurn = changeTurn();
    }

    console.log('play successful for game: %s', id);
    console.log('board: %s', board);

    return {
      success: true,
      isWin: win,
      isTie: tie,
      winningSquares: winCalculation.winningSquares || null,
      lastTurn: lastTurn,
      currentTurn: newTurn,
      board: board
    };
  }

  function hasPlayer(playerId) {
    return players.hasOwnProperty(playerId);
  }

  function isTurn(marker) {
    return marker === turn;
  }

  function changeTurn() {
    turn = (turn === "X") ? "O" : "X";
    return turn;
  }

  function calculateWin(play) {
    var returnData = { isWin: true };

    // check center square first
    if (board[4] === play) {
      for (var i = 0; i < board.length; i++) {
        var currentSquare = board[i];
        if (i === 4 || currentSquare !== play) continue;

        var oppositeSquare = 4 + (4 - i);
        if (board[oppositeSquare] === play) {
          returnData.winningSquares = [i, 4, oppositeSquare];
          return returnData;
        }
      }
    }

    if (board[0] === play) {
      //check right
      if (board[1] === play && board[2] === play) {
        returnData.winningSquares = [0, 1, 2];
        return returnData;
      }
      // check down	
      if (board[3] === play && board[6] === play) {
        returnData.winningSquares = [0, 3, 6];
        return returnData;
      }
    }

    if (board[2] === play) {
      // check down			
      if (board[5] === play && board[8] === play) {
        returnData.winningSquares = [2, 5, 8];
        return returnData;
      }
    }

    if (board[6] === play) {
      //check right
      if (board[7] === play && board[8] === play) {
        returnData.winningSquares = [6, 7, 8];
        return returnData;
      }
    }

    returnData.isWin = false;
    return returnData;
  }

  function isTie() {
    if (board.length === 9) {
      for (var i = 0; i < 9; i++) {
        if (board[i] !== "X" && board[i] !== "O")
          return false;
      }
      return true;
    }
    return false;
  }

  function gameIsFull() {
    // needs new logic
    //return players.length > 1;   
  }

  //@newBoard is to set board for testing
  function resetBoard(newBoard) {
    board = newBoard || [];
  }

  return {
    id: id,
    //isFull: gameIsFull,
    authenticate: authenticate,
    play: play,
    resetBoard: resetBoard
  };
};

exports.game = Game;

exports.create = function (id) {
  var game = new Game(id);
  games[game.id] = game;
  console.log('New game created with the id: ' + game.id);
  return game;
};

exports.get = function (id) {
  return games[id] || null;
};

exports.clearAll = function () {
  games = {};
};