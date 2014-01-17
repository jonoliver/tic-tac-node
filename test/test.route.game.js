var assert = require('assert');
var sinon = require('sinon');

var route = require('../routes/route.game');
var game = require('../modules/game');
var player = require('../modules/player');

var req = {}, res = {};
var gameCreate, gameGet;

describe('Game route', function () {
  beforeEach(function () {
    req = {
      query: {},
      session: {}
    };

    res = {
      render: function () { },
      redirect: function () { }
    };
    var testGame = { id: 'gameId', authenticate: function () { return true; }, getTurn: function () { } };
    gameCreate = sinon.stub(game, 'create')
			.returns(testGame);

    gameGet = sinon.stub(game, 'get')
			.returns(testGame);
  });

  afterEach(function () {
    gameCreate.restore();
    gameGet.restore();
  });

  describe('Query string has NO game id', function () {

    it('creates new game', function () {
      route.game(req, res);
      sinon.assert.calledOnce(game.create);
      sinon.assert.calledWith(game.create, null);
    });

  });

  describe('Query string HAS game id', function () {

    describe('game exists', function () {
      it('retrieves existing game', function () {

        req.query.id = 'gameId';

        route.game(req, res);
        sinon.assert.calledOnce(game.get);
      });
    });

    describe('game does NOT exist', function () {

      it('creates new game', function () {
        gameGet.returns(null);
        req.query.id = 'gameId';
        route.game(req, res);
        sinon.assert.calledOnce(game.create);
        sinon.assert.calledWith(game.create, req.query.id);
      });
    });
  });

  //TODO:Assert that game.authenticate, response.redirect, response.render are called correctly
  /*
	
	it('joins player to game', function(){
		var testGame = { id: 'gameId!', join: function(){}};
		var gameJoin = sinon.stub(testGame, 'join').returns(true);
		gameCreate.returns(testGame);
		req.session.playerId = 'playerId';	
		route.game(req, res);
		
		sinon.assert.calledOnce(game.join);
		sinon.assert.calledWith(game.join, req.session.playerId);
		gameJoin.restore();
	});
	
	
	describe('Session has NO player id', function(){
		sinon.test(function(){
			this.stub(player, 'create')
			.returns({ id: 'playerId!'});
			
			it('creates new player', function(){
				route.game(req, res);
				sinon.assert.calledOnce(player.create);
				
			});
			it('stores player id in session', function(){
				assert.equal(req.session.playerId, undefined);
				route.game(req, res);
				console.log('req', req);
				assert.equal(req.session.playerId, 'playerId!');
			});
		});
	});
	describe('Session HAS player id', function(){
		sinon.test(function(){
			this.stub(player, 'create')
			.returns({ id: 'playerId!'});
			
			it('does NOT create player', function(){
				sinon.assert.calledOnce(player.create);
				req.session.playerId = 'playerId';
				
			});
			it('retrieves existing player', function(){
				req.session.playerId = 'playerId';
				route.game(req, res);
			});
		});
	});	
	
	describe('Game HAS 2 players', function(){
		it('redirects to create new game?', function(){
			req.query.join = 'joinId';			
		});
	});	
	
	describe('Game HAS 1 player', function(){
		describe('Query string has NO join id', function(){
			it('redirects to create new game?', function(){
				
			});
		});
		describe('Query string HAS join id', function(){
			describe('Query string join id MATCHES game join id', function(){
				it('assigns player to game', function(){
					req.query.join = 'joinId';
					
				});
			});
			describe('Query string join id DOES NOT MATCH game join id', function(){
				it('redirects to create new game?', function(){
					req.query.join = 'joinId';
				});
			});
		});
	});	
	
	describe('Game has NO players', function(){
		it('assigns player to game', function(){
			
		});
	});
	*/
});