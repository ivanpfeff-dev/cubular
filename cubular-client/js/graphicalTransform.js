var Direction = require('./direction');
var Point = require('./point');
var Vector = require('./vector');
var Color = require('./color');
var Cube = require('./cube');

function GraphicalTransform(tileSize) {
    var OFFSET_ROTATION_X = 0;
    var OFFSET_ROTATION_Y = 1;
    var OFFSET_POSITION_X = 2;
    var OFFSET_POSITION_Y = 3;

    var getOffsetsFromObject = function(obj) {
        if (obj.turning && obj.turning != Direction.None) {
            var turnProgress = obj.getTurnProgress();
            
            if (obj.turning == Direction.Up) {
                return [-turnProgress, 0, obj.position.x - 1, obj.position.y];
            } else if (obj.turning == Direction.Down) {
                return [turnProgress, 0, obj.position.x + 1, obj.position.y];
            } else if (obj.turning == Direction.Left) {
                return [0, -turnProgress, obj.position.x, obj.position.y - 1];
            } else if (obj.turning == Direction.Right) {
                return [0, turnProgress, obj.position.x, obj.position.y + 1];
            }
        }
    
        return [0, 0, obj.position.x, obj.position.y];
    };

    var getRotationDetails = function(xZero, yZero, xOne, yOne, turning, cubeSize) {
        if (turning == Direction.Up) {
            var origin = new Point(xOne, yZero, 0);
            var angleCoefficient = -1;
            var axis = "y";
            return [origin, angleCoefficient, axis];
        }
        
        if (turning == Direction.Down) {
            var origin = new Point(xZero, yZero, 0);
            var angleCoefficient = 1;
            var axis = "y";
            return [origin, angleCoefficient, axis];
        }
        
        if (turning == Direction.Left) {
            var origin = new Point(xZero, yOne, 0);
            var angleCoefficient = 1;
            var axis = "x";
            return [origin, angleCoefficient, axis];
        }
        
        if (turning == Direction.Right) {
            var origin = new Point(xZero, yZero, 0);
            var angleCoefficient = -1;
            var axis = "x";
            return [origin, angleCoefficient, axis];
        }
    };

    var makeCubicVertices = function(xZero, yZero, xOne, yOne, size) {
        var vertices = [
            [	
            new Point(xZero, yZero, 0),
            new Point(xZero, yOne, 0),
            new Point(xOne, yOne, 0),
            new Point(xOne, yZero, 0)
            ],
            [
            new Point(xOne, yOne, 0),
            new Point(xOne, yOne, size),
            new Point(xOne, yZero, size),
            new Point(xOne, yZero, 0)
            ],
            [
            new Point(xZero, yOne, 0),
            new Point(xZero, yOne, size),
            new Point(xOne, yOne, size),
            new Point(xOne, yOne, 0)
            ],
            [
            new Point(xZero, yZero, size),
            new Point(xOne, yZero, size),
            new Point(xOne, yOne, size),
            new Point(xZero, yOne, size)
            ],
            [
            new Point(xOne, yZero, 0),
            new Point(xOne, yZero, size),
            new Point(xZero, yZero, size),
            new Point(xZero, yZero, 0)
            ],
            [
            new Point(xZero, yZero, 0),
            new Point(xZero, yZero, size),
            new Point(xZero, yOne, size),
            new Point(xZero, yOne, 0),
            ],
        ];

        return vertices;
    };

    var getVerticesForCube = function(cube, cubeSize, playerOffsets) {
        var cubeOffsets = getOffsetsFromObject(cube);
        var relativeX = cubeOffsets[OFFSET_POSITION_X] - playerOffsets[OFFSET_POSITION_X] + playerOffsets[OFFSET_ROTATION_X];
        var relativeY = cubeOffsets[OFFSET_POSITION_Y] - playerOffsets[OFFSET_POSITION_Y] + playerOffsets[OFFSET_ROTATION_Y];
        
        var xZero = relativeX * tileSize;
        var xOne = xZero + cubeSize;
        var yZero = relativeY * tileSize;
        var yOne = yZero + cubeSize;
        var vertices = makeCubicVertices(xZero, yZero, xOne, yOne, cubeSize);

        if(cube.turning && cube.turning != Direction.None) {
            var rotationDetails = getRotationDetails(xZero, yZero, xOne, yOne, cube.turning, cubeSize);
            var origin = rotationDetails[0];
            var angleCoefficient = rotationDetails[1];
            var axis = rotationDetails[2];
            var rotationAngle = cube.getAngle() * angleCoefficient;
            if(axis == "x"){
                vertices = vertices.map(function(face) {
                    return face.map(function(vertex) {
                        return vertex.rotateX(origin, rotationAngle);
                    })
                });
            }

            if(axis == "y"){
                vertices = vertices.map(function(face) {
                    return face.map(function(vertex) {
                        return vertex.rotateY(origin, rotationAngle);
                    })
                });
            }
        }
        
        return vertices;
    };

    var getVerticesForFood = function(food, foodSize, playerOffsets) {
        var foodOffsets = getOffsetsFromObject(food);
        var relativeX = foodOffsets[OFFSET_POSITION_X] - playerOffsets[OFFSET_POSITION_X] + playerOffsets[OFFSET_ROTATION_X];
        var relativeY = foodOffsets[OFFSET_POSITION_Y] - playerOffsets[OFFSET_POSITION_Y] + playerOffsets[OFFSET_ROTATION_Y];
        
        var padding = (tileSize - foodSize) / 2;
        var xZero = relativeX * tileSize + padding;
        var xOne = xZero + foodSize;
        var yZero = relativeY * tileSize + padding;
        var yOne = yZero + foodSize;

        var vertices = makeCubicVertices(xZero, yZero, xOne, yOne, foodSize);
        
        return vertices;
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
        }).slice(-4);
    };
    
    this.getDisplayVertices = function(playerCube, cubes, cubeSize, foods, foodSize) {
        var offsets = getOffsetsFromObject(playerCube);

        var cubeVertices = cubes.map(function(cube) {
            return getVerticesForCube(cube, cubeSize, offsets);
        });
        
        var foodVertices = foods.map(function(food) {
            return getVerticesForFood(food, foodSize, offsets);
        })

        return cubeVertices
            .concat(foodVertices)
            .map(function(vertices) {
            return depthSort(vertices);
            }).reduce(function(a, b) {
                return a.concat(b);
            }, []);
    };
};

module.exports = GraphicalTransform;