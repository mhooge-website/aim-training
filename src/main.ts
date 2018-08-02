import { Game } from "./game";
import { GameHoldAngle } from "./gamemode1";
import * as $ from "jquery";
import { CanvasHelper } from "./canvashelper";

var currentGame : Game;

function initialize() {
    currentGame = new GameHoldAngle("Hold Angle");
    currentGame.init()
}

function createLogoLine(x : number, y : number, length : number, color : string) {
    return {
        x: 0,
        y: 0,
        length: 100,
        color: "black",
        draw: function() {
            CanvasHelper.setFillColor(this.color);
            CanvasHelper.drawRectangle(this.x, this.y, this.length, 4);
        }
    };
}

function animateLogo() {
    let line = {
        x: 0,
        y: 0,
        length: 100,
        color: "black",
        draw: function() {
            CanvasHelper.setFillColor(this.color);
            CanvasHelper.drawRectangle(this.x, this.y, )
        }
    };

    let id = setInterval(() => {

    }, 100);
}

// $( document ).ready(() =>
//     initialize()
// );