var uid = require('uid2');

var games = {};

var Game = function(gameId){
  var id = gameId || uid(10);
  var players = [];
  var board = [];
  var turn = "X";
  
  function authenticate(playerId){
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
    
    var currentTurn = turn;
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
    var win = isWin(player.marker);
    var tie = isTie();
    
    if (win || tie) {
      resetBoard();
    } else {
      changeTurn();
    }
    
    console.log('play successful for game: %s', gameId);
    console.log('board: %s', board);
    
    return {
      success: true,
      isWin: win,
      isTie: tie,
      turn: currentTurn, //TODO: get rid of?
      board: board
    };
  }
  
  function hasPlayer(playerId) {
    return players.hasOwnProperty(playerId);
  }
 
  function isTurn(marker){
    return marker === turn;
  }
  
  function changeTurn(){
    turn = (turn === "X") ? "O" : "X";
  }
  
	function isWin(play){
		// check center square first
		if (board[4] === play){
			for (var i=0; i < board.length; i++){
				var currentSquare = board[i];
				if (i === 4 || currentSquare !== play) continue;
				
				var oppositeSquare = 4 + (4 - i);
				if (board[oppositeSquare] === play)
					return true;
			}
		}
		
		if (board[0] === play){
			//check right
			if (board[1] === play && board[2] === play)
				return true;
			// check down	
			if (board[3] === play && board[6] === play)
				return true;
		}
		
		if (board[2] === play){
			// check down			
			if (board[5] === play && board[8] === play)
				return true;	
		}
		
		if (board[6] === play){
			//check right
			if (board[7] === play && board[8] === play)
				return true;		
		}
		
		return false;
	}
  
	function isTie(){
		if (board.length === 9){
			for (var i=0; i<9; i++){
				if (board[i] !== "X" && board[i] !== "O")
					return false;
			}
			return true;
		}
    return false;
	}
  
  function gameIsFull(){
    // needs new logic
    //return players.length > 1;   
  }
  
  //@newBoard is to set board for testing
  function resetBoard(newBoard){
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

exports.create = function(id){
  var game = new Game(id);
  games[game.id] = game;
  console.log('New game created with the id: ' + game.id);
  return game;
};

exports.get = function(id){
  return games[id] || null;
};

exports.clearAll = function(){
  games = {};
};