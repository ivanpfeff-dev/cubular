var Direction = require('./direction');
var Point = require('./point');
var Vector = require('./vector');
var Color = require('./color');
var Cube = require('./cube');
var GraphicalTransform = require('./graphicalTransform');

function Face(vertices) {
  this.vertices = vertices;
  this.available = 0;
  this.drawn = false;
  this.target = this.vertices.length;
};

function Renderer(floorCanvas, gameCanvas, world) {
  //kind of hacky but convenient to have all isometry in the Point class
  Point.setOrigin(gameCanvas.width / 2, gameCanvas.height * 0.5);

  var TILE_SIZE = 80;
  var FOOD_SIZE = 15;
  var CUBE_SIZE = TILE_SIZE;
  var TILE_WIDTH = 2 * CUBE_SIZE * Point.isoTransform[0][0];
  var TILE_HEIGHT = 2 * CUBE_SIZE * Point.isoTransform[0][1];
  var TWICE_TILE_HEIGHT = Math.round(2 * TILE_WIDTH);
  var TWICE_TILE_WIDTH = Math.round(2 * TILE_HEIGHT);
  var QUAD_TILE_WIDTH = Math.round(4 * TILE_WIDTH);
  var QUAD_TILE_HEIGHT = Math.round(4 * TILE_HEIGHT);

  var graphicalTransform = new GraphicalTransform(TILE_SIZE);
  
  var offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = floorCanvas.width + QUAD_TILE_WIDTH;
  offscreenCanvas.height = floorCanvas.height + QUAD_TILE_HEIGHT;

  var offscreenContext = offscreenCanvas.getContext('2d');
  var floorContext = floorCanvas.getContext('2d');
  var gameContext = gameCanvas.getContext('2d');

  offscreenContext.strokeStyle = 'ffffff';
  floorContext.strokeStyle = 'ffffff';
  gameContext.strokeStyle = 'ffffff';

  var lightPosition = new Vector(2, -1, 3);
  var lightAngle = lightPosition.normalize();
  var baseColor = new Color(120, 120, 120);
  var lightColor = new Color(255, 255, 255);
  var colorDifference = 0.20;
  
  //Draw the floor to an offscreen canvas for pasting later
  (function() {
    offscreenContext.fillStyle = "blue";
    offscreenContext.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenContext.translate(TWICE_TILE_WIDTH, TWICE_TILE_HEIGHT);

    var screenWidthInTiles = Math.round(floorCanvas.width / TILE_WIDTH);
    var screenHeightInTiles = Math.round(floorCanvas.height / TILE_HEIGHT);
    var decidingMeasurement = Math.max(screenWidthInTiles, screenHeightInTiles);

    for(var i = -decidingMeasurement; i < decidingMeasurement; i++) {
      var currentX = CUBE_SIZE * i;
      var pt1 = new Point(currentX, -2000, 0).getIso();
      var pt2 = new Point(currentX, 2000, 0).getIso();
      offscreenContext.moveTo(pt1.x, pt1.y);
      offscreenContext.lineTo(pt2.x, pt2.y);
    }
    for(var i = -decidingMeasurement; i < decidingMeasurement; i++) {
      var currentY = CUBE_SIZE * i;
      var pt1 = new Point(-2000, currentY, 0).getIso();
      var pt2 = new Point(2000, currentY, 0).getIso();
      offscreenContext.moveTo(pt1.x, pt1.y);
      offscreenContext.lineTo(pt2.x, pt2.y);
    }

    offscreenContext.stroke();
  }());

  var clear = function() {
    floorContext.clearRect(0, 0, floorCanvas.width, floorCanvas.height);      
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  };

  var renderFloor = function(offsets) { 
    var yFactor = CUBE_SIZE * offsets[0];
    var xFactor = CUBE_SIZE * offsets[1];
    var xOffset = xFactor * Point.isoTransform[0][0] + yFactor * Point.isoTransform[1][0];
    var yOffset = xFactor * Point.isoTransform[0][1] + yFactor * Point.isoTransform[1][1];

    floorContext.translate(-xOffset - TWICE_TILE_WIDTH, -yOffset - TWICE_TILE_HEIGHT);
    floorContext.drawImage(offscreenCanvas, 0, 0);
    floorContext.translate(xOffset + TWICE_TILE_WIDTH, yOffset + TWICE_TILE_HEIGHT);
  };

  var depthSort = function(faces) {
    var depthMapping = faces.map(function(face) { 
      var depth = face.reduce(function(acc, val) {
        return acc + val.depth();
      }, 0) / face.length; 
     
      return {
        face: face, 
        depth: depth
      };
    });
   
    return depthMapping.sort(function(a, b) { 
      return b.depth - a.depth;
    }).map(function(mapping) { 
      return mapping.face;
    });
  };
	
  var getShadedColor = function(face) {
    var v1 = Vector.fromTwoPoints(face[1], face[0]);
    var v2 = Vector.fromTwoPoints(face[2], face[1]);
    var normal = Vector.crossProduct(v1, v2).normalize();
    var brightness = Vector.dotProduct(normal, lightAngle);
    var color = baseColor.lighten(brightness * colorDifference, lightColor);
    return color;
  };

  var renderFace = function(face) {
    gameContext.beginPath();
    for (var v in face) {
      var vertex = face[v];
      var isoVertex = vertex.getIso();
      v == 0 ? gameContext.moveTo(isoVertex.x, isoVertex.y)
          : gameContext.lineTo(isoVertex.x, isoVertex.y);
    }
    gameContext.closePath();
   
    var color = getShadedColor(face);
    gameContext.fillStyle = gameContext.strokeStyle = color.toHex();
   
    gameContext.stroke();
    gameContext.fill();
  };

  var renderFaces = function(faces) {
    var depthSortedFaces = faces;
    var vertexMap = {};
    var uniqueVertices = [];

    faces.map(function(vertices) {
      var face = new Face(vertices);
      vertices.map(function(vertex) { 
        var hash = vertex.getHash();
        if (!(hash in vertexMap)) {
          vertexMap[hash] = [];
          uniqueVertices.push(vertex);
        }
       
        vertexMap[vertex.getHash()].push(face);
      });
    });
   
    uniqueVertices.sort(function(a, b) { 
      return b.depth() - a.depth();
    });
   
    for (var v in uniqueVertices) {
      var vertex = uniqueVertices[v];
      var hash = vertex.getHash();
      var faces = vertexMap[hash];
      for (var f in faces) {
        var face = faces[f];
       
        face.available++;
        if (face.available == face.target && !face.drawn) {
          renderFace(face.vertices);
          face.drawn = true;
        }
      }
    }
  };

  var getRotationalOffsetsFromPlayerCube = function(playerCube) {
    if (playerCube.turning != Direction.None) {
        var turnProgress = playerCube.getTurnProgress();
        
        if (playerCube.turning == Direction.Up) {
          return [-turnProgress, 0];
        } else if (playerCube.turning == Direction.Down) {
          return [turnProgress, 0];
        } else if (playerCube.turning == Direction.Left) {
          return [0, -turnProgress];
        } else if (playerCube.turning == Direction.Right) {
          return [0, turnProgress];
        }
    }

    return [0, 0];
  };

  this.cycle = function() {
    var playerCube = world.playerCube;
    var cubes = world.getCubes();
    var foods = world.getFood();

    clear();
    var offsets = getRotationalOffsetsFromPlayerCube(playerCube);
    renderFloor(offsets);
    var cubeVertices = graphicalTransform.getDisplayVertices(playerCube, cubes, CUBE_SIZE, foods, FOOD_SIZE);
    renderFaces(cubeVertices);
  }
};

module.exports = Renderer;