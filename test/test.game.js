var assert = require('assert');
var game = require('../modules/game');

afterEach(function(){
  game.clearAll();
});

describe('Game route', function(){
  it('creates a game', function(){
    var newGame = game.create();
    assert(newGame.id !== null);
    assert(newGame.id !== undefined);
  });
  it('creates a game with specified id', function(){
    var id = 'gameId';
    var newGame = game.create(id);
    assert(newGame.id === id);
  });
  it('gets an existing game', function(){
    var newGame = game.create();
    var getGame = game.get(newGame.id);
    assert.equal(newGame, getGame);
  });  
  it('returns null if getting a non-existant game', function(){
    var getGame = game.get('id');
    assert.equal(getGame, null);
  });
  describe('authenticate', function(){

    it('allows only 2 players to join', function(){
      var playerId1 = '1';
      var playerId2 = '2';
      var playerId3 = '3';
      var newGame = game.create();
      assert.equal(newGame.authenticate(playerId1).success, true);
      assert.equal(newGame.authenticate(playerId2).success, true);
      assert.equal(newGame.authenticate(playerId3).success, false);
    });
    it('returns true if player has already joined', function(){
      var playerId1 = '1';
      var playerId2 = '2';
      var newGame = game.create();
      newGame.authenticate(playerId1);
      newGame.authenticate(playerId2);
      assert.equal(newGame.authenticate(playerId1).success, true);
      assert.equal(newGame.authenticate(playerId2).success, true);
    });
    
  });
  describe('play', function(){
    describe('plays  a game', function(){
      var newGame, playerId1, playerId2;
      playerId1 = '1';
      playerId2 = '2';
      newGame = game.create();
      newGame.authenticate(playerId1);
      newGame.authenticate(playerId2);      

      it('turn does not succeed if not current players turn', function(){
        var turn = newGame.play(playerId2, 0);
        assert.notEqual(turn.success, true);
        assert(typeof turn.error === 'string');
      });
      
      it('takes first turn successfully', function(){
        var turn = newGame.play(playerId1, 0);
        assert.equal(turn.success, true);
        assert(typeof turn.error !== 'string');
      });
      
      it('takes second turn successfully', function(){
        var turn = newGame.play(playerId2, 1);
        assert.equal(turn.success, true);
        assert(typeof turn.error !== 'string');
      });
      
      it('turn does not succeed if square is already taken', function(){
        var turn;
        
        turn = newGame.play(playerId1, 0);
        assert.notEqual(turn.success, true);
        assert(typeof turn.error === 'string');
        
        turn = newGame.play(playerId1, 1);
        assert.notEqual(turn.success, true);
        assert(typeof turn.error === 'string');
  
        turn = newGame.play(playerId2, 0);
        assert.notEqual(turn.success, true);
        assert(typeof turn.error === 'string');
       
        turn = newGame.play(playerId2, 1);
        assert.notEqual(turn.success, true);
        assert(typeof turn.error === 'string');
      });
      
      it('reports that game has NOT been won', function(){
        var turn;
        turn = newGame.play(playerId1, 3);
        assert.equal(turn.success, true);
        turn = newGame.play(playerId2, 4);
        assert.equal(turn.success, true);
        turn = newGame.play(playerId1, 2);
        assert.equal(turn.success, true);
        turn = newGame.play(playerId2, 5);
        assert.equal(turn.success, true);
        turn = newGame.play(playerId1, 7);
        assert.equal(turn.success, true);
        turn = newGame.play(playerId2, 8);
        assert.equal(turn.success, true);
        assert.equal(turn.isWin, false);
     });
      
      it('reports that game HAS been won', function(){
        var turn = newGame.play(playerId1, 6);
        assert.equal(turn.success, true);
        assert.equal(turn.isWin, true);       
        assert.equal(turn.isTie, false);       
      });
      
      describe('tie', function(){
        var turn;
        var board = ["X", "O", "X",
                     "X", "O", "O"];
        
        it('players make moves and game is NOT tie', function(){
          newGame.resetBoard(board);
          
          turn = newGame.play(playerId1, 7);
          turn = newGame.play(playerId2, 6);
          
          assert.equal(turn.success, true);
          assert.equal(turn.isWin, false);       
          assert.equal(turn.isTie, false);
        });
        
        it('player makes move and game IS tie', function(){
          turn = newGame.play(playerId1, 8);
          assert.equal(turn.success, true);
          assert.equal(turn.isWin, false);       
          assert.equal(turn.isTie, true);       
        });
      });
    });
  });
});