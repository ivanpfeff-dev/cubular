function Point(x, y, z) {
  if (this instanceof Point) {
    this.x = (typeof x === 'number') ? x : 0;
    this.y = (typeof y === 'number') ? y : 0;
    this.z = (typeof z === 'number') ? z : 0;
  } else {
    return new Point(x, y, z);
  }
}

Point.prototype.equals = function(other) { 
  return this.getHash() === other.getHash();
};

Point.ORIGIN = new Point(0, 0, 0);

Point.prototype.translate = function(dx, dy, dz) {
 
  dx = (typeof dx === 'number') ? dx : 0;
  dy = (typeof dy === 'number') ? dy : 0;
  dz = (typeof dz === 'number') ? dz : 0;

  return new Point(
    this.x + dx,
    this.y + dy,
    this.z + dz);
};


Point.prototype.getCoordinateHash = function() {
  if (this._coordinateHash === undefined) {
    this._coordinateHash = '' + Math.round(this.x /100) + '/' + Math.round(this.y /100);
  }
  return this._coordinateHash;
};

Point.prototype.getHash = function() {
  if (this._hash === undefined) {
    this._hash = '' + this.x + '/' + this.y + '/' + this.z;
  }
  return this._hash;
};

Point.prototype.multiply = function(multiplier) {
  return new Point(this.x * multiplier, this.y * multiplier, this.z * multiplier);
};

Point.prototype.sumCoordinates = function() {
  return this.x + this.y + this.z;
};

Point.prototype.scale = function(origin, dx, dy, dz) {
  var p = this.translate(-origin.x, -origin.y, -origin.z);

  if (dy === undefined && dz === undefined) {
    /* If both dy and dz are left out, scale all coordinates equally */
    dy = dz = dx;
    /* If just dz is missing, set it equal to 1 */
  } else {
    dz = (typeof dz === 'number') ? dz : 1;
  }

  p.x *= dx;
  p.y *= dy;
  p.z *= dz;

  return p.translate(origin.x, origin.y, origin.z);
};

Point.prototype.rotateX = function(origin, angle) {
  var p = this.translate(-origin.x, -origin.y, -origin.z);

  var z = p.z * Math.cos(angle) - p.y * Math.sin(angle);
  var y = p.z * Math.sin(angle) + p.y * Math.cos(angle);
  p.z = z;
  p.y = y;

  return p.translate(origin.x, origin.y, origin.z);
};

Point.prototype.rotateY = function(origin, angle) {
  var p = this.translate(-origin.x, -origin.y, -origin.z);

  var x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
  var z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
  p.x = x;
  p.z = z;

  return p.translate(origin.x, origin.y, origin.z);
};

Point.prototype.rotateZ = function(origin, angle) {
  var p = this.translate(-origin.x, -origin.y, -origin.z);

  var x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
  var y = p.x * Math.sin(angle) + p.y * Math.cos(angle);
  p.x = x;
  p.y = y;

  return p.translate(origin.x, origin.y, origin.z);
};


Point.prototype.depth = function() {
  return this.x + this.y + 0.01 * this.z;
};

Point.distance = function(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var dz = p2.z - p1.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

Point.originX = 0;
Point.originY = 0;
Point.setOrigin = function(x, y) {
  Point.originX = x;
  Point.originY = y;
};
Point.isoAngle = Math.PI / 6;
Point.isoAngleComplement = Math.PI - Point.isoAngle;
Point.isoTransform = 
[
	[
	  Math.cos(Point.isoAngle),
	  Math.sin(Point.isoAngle)
	],
	[
	  Math.cos(Point.isoAngleComplement),
	  Math.sin(Point.isoAngleComplement)
	]
];

Point.prototype.getIso = function() {
  var xMap = new Point(this.x * Point.isoTransform[0][0],
        this.x * Point.isoTransform[0][1]);

  var yMap = new Point(this.y * Point.isoTransform[1][0],
        this.y * Point.isoTransform[1][1]);

  var x = Point.originX + xMap.x + yMap.x;
  var y = Point.originY - xMap.y - yMap.y - (this.z);
  return new Point(Math.round(x), Math.round(y));	
};

module.exports = Point;
