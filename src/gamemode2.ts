import { Game } from "./game";
import { CanvasHelper } from "./canvashelper";
import { Target } from "./target";
import { Countdown } from "./countdown";

export class GameFlick extends Game {
    private targetDiameter = 44;

    targetHit(target : Target) {
        super.targetHit(target);
        CanvasHelper.eraseAll(this.canvas);
        
        this.activeTargets = [];
        let multiplier = this.reactTimes[this.reactTimes.length-1] > 1000 ? 1 : (1000/this.reactTimes[this.reactTimes.length-1]) * 2;
        this.score += multiplier;

        super.drawPointsForHit(target, multiplier);
        this.gameLoop();
    }

    init() {
        super.init();
        this.gameLoop();
    }

    private getTargetPos() {
        let posOffset = Math.random() > 0.5;
        let x = Math.random() * (this.canvas.width/2);
        let y = Math.random() * this.canvas.height;
        if(y > this.canvas.height - this.targetDiameter) y = this.canvas.height - this.targetDiameter;

        return {
            x: posOffset ? this.canvas.width/2 + x : this.canvas.width/2 - x,
            y: y
        };
    }

    private drawTarget(target : Target) {
        CanvasHelper.setFillColor("rgb(255, 0, 0)");
        CanvasHelper.fillCircle(target.x, target.y, target.d/2);
    }

    gameLoop() {
        let pos = this.getTargetPos();
        CanvasHelper.setFont("50px serif");
        Countdown.createCountdown(this.canvas.offsetWidth/2+10, this.canvas.height/2-30);

        setTimeout(() => {
            this.activeTargets = [this.createTarget(pos.x, pos.y, this.targetDiameter)];
            this.drawTarget(this.activeTargets[0]);
            console.log(this.canvas.width);
            CanvasHelper.drawLine(1300, 300, 1300, 400);

        }, 4000);
    }
}