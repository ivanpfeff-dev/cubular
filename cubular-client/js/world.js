var Point = require('./point');
var Cube = require('./cube');

function World(playerCube) {
  this.cubesByIdentification = {};
  this.cubesByCoordinate = {};
  this.foodByIdentification = {};
  this.foodByCoordinate = {};
  this.playerCube = null;
  var self = this;
	
  var addCoordinateEntry = function(dictionary, entry) {
    var coordinateHash = entry.position.getCoordinateHash();
    if (!(coordinateHash in dictionary)) {
      dictionary[coordinateHash] = [];
    }
    dictionary[coordinateHash].push(entry);
  };

  var removeCoordinateEntry = function(dictionary, entry) {
    var coordinateHash = entry.position.getCoordinateHash();
    if (coordinateHash in dictionary) {
      var bucket = dictionary[coordinateHash];
      var idx = bucket.indexOf(entry);
      if(idx){
        bucket.splice(idx, 1);
      }
    }
  };
	
  this.addCube = function(cube) {
    this.cubesByIdentification[cube.id] = cube;
    addCoordinateEntry(this.cubesByCoordinate, cube);
  };
  
  this.addFood = function(food) {
    this.foodByIdentification[food.id] = food;
    addCoordinateEntry(this.foodByCoordinate, food);
  };
	
  this.refreshCubeCoordinates = function() {
    for (var idx in this.cubesByIdentification) {
      var cube = this.cubesByIdentification[idx];
      if(cube.shouldMove()) {
        cube.resetTurn();
        var nextPosition = cube.getNextPosition();
        this.moveCube(cube, nextPosition);
      }
    }
  };

  this.moveCube = function(cube, position) {
    var oldCoordinateHash = cube.position.getCoordinateHash();
    var newCoordinateHash = position.getCoordinateHash();
    var needsRelocation = oldCoordinateHash !== newCoordinateHash;
    if(needsRelocation) {
      removeCoordinateEntry(this.cubesByCoordinate, cube);
    }
    cube.position = position;
    if(needsRelocation) {
      addCoordinateEntry(newCoordinateHash);    
    }
  };
  
  this.getCube = function(id) {
    return this.cubesByIdentification[id];
  };
  
  this.removeCube = function(cube) {
    removeCoordinateEntry(this.cubesByCoordinate, cube);
    delete this.cubesByIdentification[cube.id];
  };

  this.getCubes = function() {
    var cubes = [];
    for (var idx in this.cubesByIdentification) {
      var cube = this.cubesByIdentification[idx];
      cubes.push(cube);
    }
    return cubes;
  };

  this.getFood = function() {
    var foods = [];
    for (var idx in this.foodByIdentification) {
      var food = this.foodByIdentification[idx];
      foods.push(food);
    }
    return foods;
  };

  this.canMove = function(cube, direction) {
    var nextPosition = cube.getNextPosition(direction);
    var cubesInArea = this.cubesByCoordinate[nextPosition.getCoordinateHash()];
    if(cubesInArea) {
      return !cubesInArea.some(function(cube) {
        return cube.position.equals(nextPosition);
      });
    }

    return true;
  };

  this.cycle = function() {
    this.refreshCubeCoordinates();
  };

};

module.exports = World;