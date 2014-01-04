var players = {};

var Player = function(aname){
  var wins = 0;
  var name = aname;
  var id = Math.random();
  var player = {
    id: id,
    name: name,
    wins: function(){
      return wins;
    }
  };
  players[id] = player;
  return player;
};
exports.create = function(){
  return new Player();
};
exports.get = function(id){
  return players[id] || null;
};
