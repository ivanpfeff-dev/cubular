$(document).ready(function () {
	var floorCanvas = document.getElementById("floorCanvas");
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width  = window.innerWidth;
	gameCanvas.height = window.innerHeight;
	floorCanvas.width  = window.innerWidth;
	floorCanvas.height = window.innerHeight;
	
	var game = new Cubular(floorCanvas, gameCanvas);
	game.start();
});
