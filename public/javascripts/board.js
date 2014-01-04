var Board = function(){
	var board = [];
	
	// for testing
	function setBoard(newBoard){
		board = newBoard;
	}
	
	function setSquare(index, play){
		board[index] = play;
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
	
	function isCatsGame(){
		if (board.length === 9){
			for (var i=0; i<9; i++){
				if (board[i] !== "X" && board[i] !== "O")
					return false;
			}
			return true;
		}
	}
	return {
		isWin: isWin,
		isCatsGame: isCatsGame,
		setSquare: setSquare,
		setBoard: setBoard
	};
};


var testX1 = [
    "X", "O", "",
    "O", "X", "",
    "O", "X", "X",
];

var testX2 = [
    "", "X", "",
    "", "X", "",
    "", "X", "",
];

var testX3 = [
    "", "", "X",
    "", "X", "",
    "X", "", "",
];

var testX4 = [
    "", "", "",
    "X", "X", "X",
    "", "", "",
];

var testX5 = [
    "X", "X", "X",
    "", "", "",
    "", "", "",
];

var testX6 = [
    "X", "", "",
    "X", "", "",
    "X", "", "",
];
var testX7 = [
    "", "", "X",
    "", "", "X",
    "", "", "X",
];
var testX8 = [
    "", "", "",
    "", "", "",
    "X", "X", "X",
];
var testX9 = [
    "X", "X", "X",
    "O", "X", "",
    "O", "O", "O",
];

var testBoard = new Board();
console.log("X");
testBoard.setBoard(testX1);
console.log(testBoard.isWin("X"));
testBoard.setBoard(testX2);
console.log(testBoard.isWin("X"));
testBoard.setBoard(testX3);
console.log(testBoard.isWin("X"));
testBoard.setBoard(testX4);
console.log(testBoard.isWin("X"));
testBoard.setBoard(testX5);
console.log(testBoard.isWin("X"));
testBoard.setBoard(testX6);
console.log(testBoard.isWin("X"));
testBoard.setBoard(testX7);
console.log(testBoard.isWin("X"));
testBoard.setBoard(testX8);
console.log(testBoard.isWin("X"));
testBoard.setBoard(testX9);
console.log(testBoard.isWin("X"));