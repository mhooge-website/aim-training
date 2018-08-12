import { Game } from "./game";
import { Target } from "./target";

enum MovePattern {
    Random,
    Short,
    Long
}

export class GameCustom extends Game {
    private targetMovePattern : MovePattern = null;
    private targetLifetime = 0;
    private targetGrows = false;
    private maxActiveTargets = 1;
    private spawnDelay = 1000;

    init() {
        super.init();
        this.setGameParameters();
        this.gameLoop();
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
            let moveShortChckBox = $("#custom-move-random").get(0) as HTMLInputElement
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
    
    private setGameParameters() {
        this.setMovePattern();
        this.setTargetLifetime();
        this.setTargetGrows();
        this.setTargetDiameter();
        this.setMaxActiveTargets();
        this.setSpawnDelay();
        console.log(this.targetMovePattern);
        console.log(this.targetLifetime);
        console.log(this.targetGrows);
        console.log(this.targetDiameter);
        console.log(this.maxActiveTargets);
        console.log(this.spawnDelay);
    }



    gameLoop() {
        setTimeout(() => {
            let x = super.getRandomX(this.targetDiameter);
            let y = super.getRandomY(this.targetDiameter);
            this.activeTargets.push(super.createTarget(x, y, 2));
            if (this.activeTargets.length < this.maxActiveTargets) this.gameLoop();
        }, this.spawnDelay);
    }
}