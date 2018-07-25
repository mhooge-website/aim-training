import { Game } from "./game";
import { GameHoldAngle } from "./gamemode1";
import * as $ from "jquery";

var currentGame : Game;

function initialize() {
    currentGame = new GameHoldAngle("Hold Angle");
    currentGame.init()
}

$( document ).ready(() =>
    initialize()
);