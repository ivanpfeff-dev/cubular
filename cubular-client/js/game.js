var Point = require('./point');
var Cube = require('./cube');
var Food = require('./food');
var World = require('./world');
var Renderer = require('./renderer');
var Network = require('./network');
var InputManager = require('./inputManager');

window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();

function Game(floorCanvas, gameCanvas) {
  var world = new World();
  var network = new Network(world);
  var input = new InputManager(world, network);
  var renderer = new Renderer(floorCanvas, gameCanvas, world);
  
  var handleInput = function(direction) {
    
  };

  this.start = function () {
    network.beginConnect();
    window.requestAnimationFrame(cycle);
  };
   
  var cycle = function() {
    network.cycle();

    if(world.playerCube) {
      world.cycle();
      input.cycle();
      renderer.cycle();
    }

    window.requestAnimationFrame(cycle);    
  };
};

module.exports = Game;