var Game = require('../modules/game');

exports.onConnection = function(socket, sessionStore, cookieParser){
  var sessionKey = null;
  
  cookieParser(socket.handshake, {}, function (parseErr) {
    sessionKey = findCookie(socket.handshake);    
  });
  
  var gameId = socket.handshake.query.id;
   
  
  socket.join(gameId);
 
  socket.on('play', function(data){
    var returnData = { success: false };
    var game = Game.get(gameId);
    console.log('sessionKey');
    console.log(sessionKey);
    
    console.log('game');
    console.log(game);
    
    if (game === null) {
      console.log('cannot find game %s', gameId);
      //TODO: handle null game
      return;
    }
    
    if (game.authenticate(sessionKey)) {
      console.log('Hooray we authenticated!');
      var play = game.play(sessionKey, data.position);
      returnData.board = play.board;
      if (play.success) {
        returnData.lastTurn = play.lastTurn;
        returnData.currentTurn = play.currentTurn;
        returnData.isWin = play.isWin;
        returnData.isTie = play.isTie;
        returnData.winningSquares = play.winningSquares;
      }
      else {
        returnData.error = play.error;
      }
    }
    else {
      returnData.error = 'BOOOOUURNS no authentication :(';
    }
    
    //socket.emit('update', data);
    returnData.position = data.position;
    console.log('returnData.error');
    console.log(returnData.error);
    if (returnData.error) {
      socket.emit('playerror', returnData);
    }
    else{
      socket.broadcast.to(gameId).emit('update', returnData);
      
      if (returnData.isWin || returnData.isTie) {
        // only broadcast to opponent once if game is over (do not broadcast update above)
        socket.broadcast.to(gameId).emit('gameover', returnData);
        socket.emit('gameover', returnData);
      }
  }
   
    /*
    // load session with sessionKey
    sessionStore.load(sessionKey, function (storeErr, session) {
      console.log("session");
      console.log(session);
    });
    */
  
  });
};

function findCookie(handshake) {
  var key = 'connect.sid';
  return (handshake.secureCookies && handshake.secureCookies[key]) ||
    (handshake.signedCookies && handshake.signedCookies[key]) ||
    (handshake.cookies && handshake.cookies[key]);
}