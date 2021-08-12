var Point = require('./point');

function Food() {
  this.position = new Point(0, 0, 0);
  this.id = '' + new Date().getTime(); //arbitrary for now, later will be dictated by server
}

Food.prototype.translate = function(x, y, z) {
  this.position = this.position.translate(x, y, z);
};

module.exports = Food;