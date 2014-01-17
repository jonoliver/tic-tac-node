var Game = require('../modules/game');

exports.game = function(req, res){
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
    res.render('game', { 
      title: 'TIC|TAC|NODE', 
      player: auth.player, 
      turn: game.getTurn(),
      board: auth.board 
    });
  }
};