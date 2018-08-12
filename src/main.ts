import { Game } from "./game";
import { GameHoldAngle } from "./gamemode1";
import { GameFlick } from "./gamemode2";
import { GameSwarm } from "./gamemode3";
import { GameCustom } from "./custom_gamemode";
import * as $ from "jquery";

var currentGame : Game;

function showCustomGameMenu() {
    $("#custom-game-div").get(0).style.display = "block";
}

function initializeGame(gamemode : number) {
    switch(gamemode) {
        case 0: currentGame = new GameHoldAngle("Hold Angle");
        break;
        case 1: currentGame = new GameFlick("Flick");
        break;
        case 2: currentGame = new GameSwarm("Swarm");
        break;
        case 3: 
            currentGame = new GameCustom("Swarm");
            showCustomGameMenu();
        break;
    }
    
    let menuDiv = $("#menu-div").get(0);
    menuDiv.style.display = "none";
    if(gamemode != 3) currentGame.init()
}

function setupCustomGameMenu() {
    // Functionality for showing 'target move-patterns' div, when 'moving targets'
    // button is checked.
    let customChck = $("#custom-moving-targets").get(0) as HTMLInputElement;
    var customMoveDiv = $("#move-pattern-div").get(0);
    customChck.onclick = () => {
        customMoveDiv.style.display = "block";
        customMoveDiv.style.animationPlayState = "running"
        customMoveDiv.style.animationName = "expand-div";
        customChck.disabled = true;
        setTimeout(() => {
            customMoveDiv.style.animationPlayState = "paused";
            customChck.disabled = false;
        }, 750);
    }

    // Functionality for disabling radio buttons indicating other forms of
    // move-patterns, when one such form is selected.
    let customMoveRadios = $("#move-pattern-div > input");
    for(let i = 0; i < customMoveRadios.length; i++) {
        let radioButton = customMoveRadios[i] as HTMLInputElement;
        let otherButtons : HTMLInputElement[] = [];
        for(let j = 0; j < customMoveRadios.length; j++) {
            if(i != j) {
                let otherButton = customMoveRadios[j] as HTMLInputElement;
                otherButtons.push(otherButton);
            }
        }
        radioButton.onclick = () => {
            setTimeout(() => {
                for(let j = 0; j < otherButtons.length; j++) {
                    otherButtons[j].checked = !radioButton.checked;
                }
            }, 50);
        };
    }

    // Functionality for starting the custom game, and for exiting to main menu.
    let actionButtons = $("#custom-button-div > button");
    let backButton = actionButtons.get(1) as HTMLButtonElement;
    backButton.onclick = () => {
        $("#custom-game-div").get(0).style.display = "none";
        $("#menu-div").get(0).style.display = "block";
    };
    let startButton =  actionButtons.get(0) as HTMLButtonElement;
    startButton.onclick = () => {
        $("#custom-game-div").get(0).style.display = "none";
        currentGame.init();
    };
}

$( document ).ready(() => {
    let buttons = $("#menu-buttons > button");
    for(let i = 0; i < buttons.length; i++) {
        let button = buttons[i] as HTMLButtonElement;
        button.onclick = function(e) {
            initializeGame(i);
        };
    }
    setupCustomGameMenu();
});