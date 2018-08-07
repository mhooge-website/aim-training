import { CanvasHelper } from "./canvashelper";

function drawNumber(n : number, x : number, y : number) {
    let counter = 0;
    let oldFontSize = parseInt(CanvasHelper.drawCtx.font.slice(0, 2));
    let maxFontSize = oldFontSize * 2;
    let fontSize = maxFontSize;
    let id = setInterval(() => {
        fontSize = fontSize - ((maxFontSize-oldFontSize)/25);
        CanvasHelper.setFillColor("rgb(255, 255, 255)");
        CanvasHelper.fillRectangle(x-5, y-100, 85, 105);
        CanvasHelper.setFont(fontSize+"px serif");
        CanvasHelper.setFillColor("rgb(0, 0, 0)");
        CanvasHelper.fillString(n+"!", x, y);
        counter++;
        if (counter > 25) {
            CanvasHelper.setFont(oldFontSize+"px serif");
            clearInterval(id);
        }
    }, 20);
}

function countdown(count : number, x : number, y : number) {
    setTimeout(
        () => {
            CanvasHelper.setFillColor("rgb(255, 255, 255)");
            CanvasHelper.fillRectangle(x-5, y-100, 85, 105);
            drawNumber(count, x, y);

            if (count > 1) countdown(count-1, x, y);
        }
    , 1000);
}

export module Countdown {
    export function createCountdown(x : number, y : number) {        
        countdown(3, x, y);
    }
}

