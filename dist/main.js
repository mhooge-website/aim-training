"use strict";
exports.__esModule = true;
var gamemode1_1 = require("./gamemode1");
var currentGame;
function initialize() {
    currentGame = new gamemode1_1.GameHoldAngle("Hold Angle");
    currentGame.init();
}
