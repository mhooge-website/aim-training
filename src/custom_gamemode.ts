import { Game } from "./game";
import { MovingTarget } from "./moving_target";
import { Target } from "./target";

enum MovePattern {
    Random,
    Short,
    Long
}

export class GameCustom extends Game {
    // Game parameters, set at custom game menu.
    private targetMovePattern : MovePattern = null;
    private targetMoveSpeed = 1;
    private targetMoveY = false;
    private targetLifetime = 0;
    private targetGrows = false;
    private maxActiveTargets = 1;
    private spawnDelay = 1000;
    private targetColor = "rgb(255, 0, 0)";

    private moveSpeedMultiplier = 3;

    init() {
        super.init();
        this.setGameParameters();
        this.gameLoop();
        if (this.targetGrows || this.targetMovePattern != null) {
            if (this.targetLifetime > 0) this.animationLoop(this.targetLifetime);
            else this.animationLoop(2000);
        }
    }

    private animationLoop(duration : number) {
        let frames = 40;
        let deltaSize = this.targetDiameter/(frames/2);
        setInterval(() => {
            if (this.targetGrows) super.resizeTargets(duration, deltaSize);
            if (this.targetMovePattern != null) this.moveTargets();
        }, duration/frames);
    }

    private move(dir : number, changeDir : boolean, target : MovingTarget, xAxis : boolean) {
        let targetRadius = this.targetDiameter/2
        let delta = (this.targetMoveSpeed * this.moveSpeedMultiplier);

        if (changeDir) {
            dir *= -1;
            if (xAxis) target.startX = target.x;
            else target.startY = target.y;
        }
        if (xAxis) {
            target.x += delta * dir;
            if (target.x > this.canvas.width - targetRadius) target.x = this.canvas.width - targetRadius;
            else if (target.x < targetRadius) target.x = targetRadius;
        }
        else {
            target.y += delta * dir;
            if (target.y > this.canvas.height - targetRadius) target.y = this.canvas.height - targetRadius;
            else if (target.y < targetRadius) target.y = targetRadius;
        }
    }

    private moveRandomly(target : MovingTarget) {
        let changeDirThreshold = 0.9;

        let distMoved = target.x - target.startX;
        let changeDir = Math.random() > changeDirThreshold;

        let dir = distMoved > 0 ? 1 : -1;

        this.move(dir, changeDir, target, true);

        if (this.targetMoveY) {
            distMoved = target.x - target.startX;
            changeDir = Math.random() > changeDirThreshold;

            dir = distMoved > 0 ? 1 : -1;
            this.move(dir, changeDir, target, false);
        }
    }

    private moveShort(target : MovingTarget) {
        let maxStep = 60;

        let distMoved = target.x - target.startX;
        let changeDir = Math.abs(distMoved) > maxStep;

        let dir = distMoved > 0 ? 1 : -1;

        this.move(dir, changeDir, target, true);
        
        if (this.targetMoveY) {
            distMoved = target.x - target.startX;
            changeDir = Math.abs(distMoved) > maxStep;

            dir = distMoved > 0 ? 1 : -1;
            this.move(dir, changeDir, target, false);
        }
    }

    private moveLong(target : MovingTarget) {
        let maxStep = 120;

        let distMoved = target.x - target.startX;
        let changeDir = Math.abs(distMoved) > maxStep;

        let dir = distMoved > 0 ? 1 : -1;

        this.move(dir, changeDir, target, true);
        
        if (this.targetMoveY) {
            distMoved = target.x - target.startX;
            changeDir = Math.abs(distMoved) > maxStep;

            dir = distMoved > 0 ? 1 : -1;
            this.move(dir, changeDir, target, false);
        }
    }

    private moveTargets() {
        for(let i = 0; i < this.activeTargets.length; i++) {
            let target = this.activeTargets[i] as MovingTarget;

            if (target == undefined) {
                continue;
            }

            super.eraseTarget(target);

            switch (this.targetMovePattern) {
                case MovePattern.Random:
                    this.moveRandomly(target);
                break;
                case MovePattern.Short:
                    this.moveShort(target);
                break;
                case MovePattern.Long:
                    this.moveLong(target);
                break;
            }

            super.drawTarget(target);
        }
    }

    private setMovePattern() {
        // Should targets move. If so, by which pattern.
        let moveChckBox = $("#custom-moving-targets").get(0) as HTMLInputElement;
        let targetsMove = moveChckBox.checked;
        if (targetsMove) {
            let moveRandomChckBox = $("#custom-move-random").get(0) as HTMLInputElement
            if (moveRandomChckBox.checked) {
                this.targetMovePattern = MovePattern.Random;
                return;
            }
            let moveShortChckBox = $("#custom-move-short").get(0) as HTMLInputElement
            if (moveShortChckBox.checked) {
                this.targetMovePattern = MovePattern.Short;
            }
            else {
                this.targetMovePattern = MovePattern.Long;
            }
        }
    }

    private clampInputValue(input : HTMLInputElement) {
        // Extracts a value from a number input field.
        // If the value is less than min, or above max,
        // it is set to min or max respectively.
        let value = parseInt(input.value);
        let min = parseInt(input.min);
        let max = parseInt(input.max);
        if (value < min) return min;
        else if (value > max) return max;
        return value;
    }

    private setMoveSpeed() {
        let speedInput = $("#custom-move-speed").get(0) as HTMLInputElement;
        this.targetMoveSpeed = this.clampInputValue(speedInput);
    }

    private setMoveY() {
        this.targetMoveY = ($("#custom-move-y").get(0) as HTMLInputElement).checked;
    }

    private setTargetLifetime() {
        let lifetimeInput = $("#custom-target-lifetime").get(0) as HTMLInputElement;
        this.targetLifetime = this.clampInputValue(lifetimeInput) * 1000;
    }

    private setTargetGrows() {
        this.targetGrows = ($("#custom-target-grows").get(0) as HTMLInputElement).checked;
    }

    private setTargetDiameter() {
        let diameterInput = $("#custom-target-diameter").get(0) as HTMLInputElement;
        this.targetDiameter = this.clampInputValue(diameterInput);
    }

    private setMaxActiveTargets() {
        let activeTargetsInput = $("#custom-max-targets").get(0) as HTMLInputElement;
        this.maxActiveTargets = this.clampInputValue(activeTargetsInput);
    }

    private setSpawnDelay() {
        let spawnDelayInput = $("#custom-spawn-delay").get(0) as HTMLInputElement;
        this.spawnDelay = this.clampInputValue(spawnDelayInput) * 1000;
    }

    private setTargetColor() {
        this.targetColor = ($("#custom-target-color").get(0) as HTMLInputElement).value;
    }
    
    private setGameParameters() {
        this.setMovePattern();
        this.setMoveSpeed();
        this.setMoveY();
        this.setTargetLifetime();
        this.setTargetGrows();
        this.setTargetDiameter();
        this.setMaxActiveTargets();
        this.setSpawnDelay();
        this.setTargetColor();
    }

    targetHit(target : Target) {
        super.targetHit(target);

        let index = this.activeTargets.indexOf(target);
        this.activeTargets[index] = undefined;

        let timeMultiplier = this.reactTimes[this.reactTimes.length-1] > 1200 ? 1 : (1200/this.reactTimes[this.reactTimes.length-1]) * 3;
        
        let finalScore = timeMultiplier;

        this.score += finalScore;

        super.drawPointsForHit(target, finalScore);

        this.gameLoop();
    }

    targetExpired(target : Target) {
        super.targetExpired(target);
        this.gameLoop();
    }

    getNumberOfActiveTargets() {
        return (this.activeTargets.filter((v, i, a) => v != undefined)).length;
    }

    gameLoop() {
        setTimeout(() => {
            if (this.getNumberOfActiveTargets() >= this.maxActiveTargets) {
                return;
            }
            let x = super.getRandomX(this.targetDiameter);
            let y = super.getRandomY(this.targetDiameter);
            let d = this.targetGrows ? 2 : this.targetDiameter;
            let target = this.targetMovePattern != null ? new MovingTarget(x, y, d, this.targetColor) : super.createTarget(x, y, d, this.targetColor);
            this.activeTargets.push(target);
            if (this.targetLifetime > 0) super.startTargetLifetimeCounter(target, this.targetLifetime);
            if (!this.targetGrows) {
                super.drawTarget(target);
            }
            if (this.getNumberOfActiveTargets() < this.maxActiveTargets) {
                this.gameLoop();
            }
        }, this.spawnDelay);
    }
}