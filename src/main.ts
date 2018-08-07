import { Game } from "./game";
import { GameHoldAngle } from "./gamemode1";
import { GameFlick } from "./gamemode2";
import * as $ from "jquery";
import { CanvasHelper } from "./canvashelper";

var currentGame : Game;

function initializeGame(gamemode : number) {
    console.log(gamemode);
    switch(gamemode) {
        case 0: currentGame = new GameHoldAngle("Hold Angle");
        break;
        case 1: currentGame = new GameFlick("Flick");
        break;
    }
    
    let menuDiv = $("#menu-div")[0] as HTMLDivElement;
    menuDiv.style.display = "none";
    currentGame.init()
}

$( document ).ready(() => {
    let buttons = $("#menu-buttons > button");
    for(let i = 0; i < buttons.length; i++) {
        let button = buttons[i] as HTMLButtonElement;
        button.onclick = function(e) {
            initializeGame(i);
        };
    }
});