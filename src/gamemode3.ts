import { Game } from "./game";
import { Target } from "./target";

export class GameSwarm extends Game {
    private targetLifetime = 2000;
    private spawnDelay = 750;
    
    init() {
        super.init();
        this.targetDiameter = 44;
        this.gameLoop();
        super.resizeTargets(this.targetLifetime);
    }

    targetHit(target : Target) {
        super.targetHit(target);

        let index = this.activeTargets.indexOf(target);
        this.activeTargets[index] = undefined;
        let timeMultiplier = this.reactTimes[this.reactTimes.length-1] > 1200 ? 1 : (1200/this.reactTimes[this.reactTimes.length-1]) * 3;
        
        let finalScore = timeMultiplier;

        this.score += finalScore;

        super.drawPointsForHit(target, finalScore);
    }

    gameLoop() {
        let id = setTimeout(() => {
            let x = super.getRandomX(this.targetDiameter);
            let y = super.getRandomY(this.targetDiameter);
            this.activeTargets.push(super.createTarget(x, y, 2));
            this.gameLoop();
        }, this.spawnDelay);
    }
}