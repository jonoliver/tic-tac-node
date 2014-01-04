
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/route.user');
var game = require('./routes/route.game');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var app = express();
//Memory store to use for express/socket.io
var cookieParser = express.cookieParser('your secret here');
var sessionStore = new express.session.MemoryStore();
/*
var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
sessionSockets.on('connection', function (err, socket, session) {
  //your regular socket.io code goes here
});
*/
console.log('routes');
console.log(routes);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({
  store: sessionStore
}));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/users', user.list);
app.get('/game', game.gameRoute);

/* json test
var keepIt = [];
app.get('/jsontest', function(req,res){
  keepIt.push(req.query);
  res.send(keepIt);
});
*/

var Game = require('./modules/game');

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


io.listen(server)
/*
.set('authorization', function (handshakeData, callback) {
  console.log(handshakeData);
  callback(null, true);
})
*/
.on('connection',function(socket){ 
  game.onConnection(socket, sessionStore, cookieParser);
});