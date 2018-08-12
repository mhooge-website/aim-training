import { Game } from "./game";
import { CanvasHelper } from "./canvashelper";
import { Target } from "./target";
import { Countdown } from "./countdown";

export class GameFlick extends Game {
    targetHit(target : Target) {
        super.targetHit(target);
        CanvasHelper.eraseAll();
        
        this.activeTargets = [];
        let timeMultiplier = this.reactTimes[this.reactTimes.length-1] > 1000 ? 1 : (1000/this.reactTimes[this.reactTimes.length-1]) * 2;
        
        let finalScore = timeMultiplier;

        if (finalScore > 1) {
            let maxDistX = this.canvas.width/2;
            let maxDistY = this.canvas.height/2;
            let distX = target.x - maxDistX;
            let distY = target.y - maxDistY;
            let distance = Math.sqrt(distX * distX + distY * distY);
            let maxDist = Math.sqrt(maxDistX * maxDistX + maxDistY * maxDistY);
            let distanceMultiplier = (distance/maxDist) * 4;
            if (distanceMultiplier < 1) distanceMultiplier = 1;

            finalScore = timeMultiplier * distanceMultiplier;
        }
        this.score += finalScore;

        super.drawPointsForHit(target, finalScore);
        this.gameLoop();
    }

    init() {
        super.init();
        this.targetDiameter = 44;
        this.gameLoop();
    }

    gameLoop() {
        let x = super.getRandomX();
        let y = super.getRandomY(this.targetDiameter);
        CanvasHelper.setFont("50px serif");
        Countdown.createCountdown(this.canvas.offsetWidth/2+10, this.canvas.height/2-30);

        setTimeout(() => {
            this.activeTargets = [this.createTarget(x, y, this.targetDiameter)];
            super.drawTarget(this.activeTargets[0]);

        }, 4000);
    }
}