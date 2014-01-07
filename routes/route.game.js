var Game = require('../modules/game');
//TODO: Don't think i'll be using Player anymore,
//just going to use express session to track player
var Player = require('../modules/player'); 

//TODO: tests for this method. use tests from game method below
exports.gameRoute = function(req, res){
  var gameId = req.query.id || null;
  var game = Game.get(gameId);
  var playerId = req.session.id;
  console.log('playerId');
  console.log(playerId);
  
  if (gameId === null || game === null) {
    game = Game.create(gameId);
    res.redirect('/game?id=' + game.id);
  }
  else {
    //TODO: move game authentication into socket auth?
    var auth = game.authenticate(playerId);
    console.log('auth');
    console.log(auth);
    res.render('game', { title: 'DEV TAB!!!', player: auth.player, board: auth.board });
  }
};

//TODO: get rid of this. wire tests to gameRoute method above
exports.game = function(req, res){
  var player = Player.get(req.session.playerId || null);
  if (player === null) {
    player = Player.create(req.query.name || 'Robert Paulson');
    req.session.playerId = player.id;
  }
  
  var gameId = req.query.id || null;
  var game = Game.get(gameId);
  if (game === null) {
    game = Game.create(gameId);
  }
  
  game.authenticate(player.id);
  res.render('game', { title: 'DEV TAB!!!', player: player, game: game });
};

//TODO: figure out how to structure this code so that methods can share instance of Game
// (that's why I moved this code here)
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
        returnData.turn = play.turn;
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
      socket.emit('error', returnData);
    }
    else{
      socket.broadcast.to(gameId).emit('update', returnData);
      
      if (returnData.isWin || returnData.isTie) {
        socket.emit('update', returnData);
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
