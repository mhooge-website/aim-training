import * as $ from "jquery";
import { CanvasHelper} from "./canvashelper";
import { Target } from "./target";

export abstract class Game {
    protected name: string;
    protected canvas: HTMLCanvasElement;
    protected activeTargets : Target[] = [];
    protected score = 0;
    protected accuracy = 0;
    protected avgReactTime = 0;
    protected reactTimes : number[] = [];
    protected targetDiameter : number;
    private targetsHit = 0;
    private totalClicks = 0;
    private nightMode = false;

    constructor(name:string) {
        this.name = name;
    }

    createTarget(x : number, y: number, d : number, color="rgb(255, 0, 0)") {
        let target = new Target(x, y, d, color);
        return target;
    }

    startTargetLifetimeCounter(target : Target, lifetime : number) {
        setTimeout(() => this.targetExpired(target), lifetime);
    }

    protected targetExpired(target : Target) {
        let index = this.activeTargets.indexOf(target);
        this.activeTargets[index] = undefined;
        this.eraseTarget(target);
    }

    private addCanvasListener() {
        this.canvas.addEventListener("click", (e) => {
            this.totalClicks += 1;

            let pos = CanvasHelper.getRelativePos(e.clientX, e.clientY, this.canvas);
            for(let i = 0; i < this.activeTargets.length; i++) {
                if (this.activeTargets[i] != undefined && this.activeTargets[i].contains(pos.x, pos.y)) {
                    this.targetHit(this.activeTargets[i]);
                }
            }
            this.calculateMetrics();
            this.drawMetrics();
        });
    }
    
    init() {
        // Show canvas div, set canvas size.
        this.canvas = $("#canvas").get(0) as HTMLCanvasElement;
        let div = $("#game-div").get(0);
        let toolbarDiv = $("#game-toolbar").get(0);
        div.style.display = "block";
        div.style.height = (window.innerHeight-div.offsetTop-50) + "px";
        this.canvas.width = div.offsetWidth;
        this.canvas.height = div.offsetHeight - toolbarDiv.offsetHeight;
    
        // Add listener for night-mode button.
        let nightButton = $("#toggle-night-button").get(0) as HTMLButtonElement;
        nightButton.onclick = (ev) => {
            this.toggleNightMode(nightButton);
        } 

        CanvasHelper.setHelperContext(this.canvas.getContext("2d"));
        if (this.nightMode) 
            this.enableNightMode();
        else
            this.disableNightMode();
        CanvasHelper.setFont("24px serif");
        this.addCanvasListener();
        this.drawMetrics();
    }

    protected drawTarget(target : Target) {
        CanvasHelper.setFillColor(target.color);
        CanvasHelper.fillCircle(target.x, target.y, target.d/2);
    }

    protected eraseTarget(target : Target) {
        CanvasHelper.setFillColor(CanvasHelper.BG_COLOR);
        CanvasHelper.fillCircle(target.x-1, target.y-1, (target.d/2)+2);
    }

    protected getRandomX(borderOffset = 0) {
        let x = Math.random() * this.canvas.width;
        
        if (x + borderOffset > this.canvas.width) x = this.canvas.width - borderOffset;

        return x;
    }

    protected getRandomY(borderOffset = 0) {
        let y = Math.random() * this.canvas.height;
        
        if (y + borderOffset > this.canvas.height) y = this.canvas.height - borderOffset;

        return y;
    }

    private enableNightMode(btn : HTMLButtonElement = null) {
        let bgColor = "rgb(30, 30, 30)";
        let fgColor = "rgb(255, 255, 255)";
        
        document.body.style.backgroundColor = bgColor;
        CanvasHelper.setBackgroundColor(bgColor);
        CanvasHelper.setForegroundColor(fgColor);
        $("#metrics-div").get(0).style.color = fgColor;

        if (btn != null) {
            let img = btn.firstChild as HTMLImageElement;
            img.src = "/aim-training/resources/light_on.png";
        }

        this.nightMode = true;
    }

    private disableNightMode(btn : HTMLButtonElement = null) {
        let bgColor = "rgb(255, 255, 255)";
        let fgColor = "rgb(0, 0, 0)";
        
        document.body.style.backgroundColor = bgColor;
        CanvasHelper.setBackgroundColor(bgColor);
        CanvasHelper.setForegroundColor(fgColor);
        $("#metrics-div").get(0).style.color = fgColor;

        if (btn != null) {
            let img = btn.firstChild as HTMLImageElement;
            img.src = "/aim-training/resources/light_off.png";
        }

        this.nightMode = false;
    }

    private toggleNightMode(btn : HTMLButtonElement) {
        if (this.nightMode) {
            this.disableNightMode(btn);
        }
        else {
            this.enableNightMode(btn);
        }
        this.redraw();
    }

    targetHit(target : Target) {
        this.eraseTarget(target);
        
        this.targetsHit += 1;
        let timePassed = (new Date().getTime()) - target.timeCreated;
        this.reactTimes.push(timePassed);
    }

    drawPointsForHit(target : Target, points : number) {
        let x = target.x;
        let y = target.y-10;
        CanvasHelper.setFont("16px serif");
        CanvasHelper.setFillColor(CanvasHelper.FG_COLOR);
        CanvasHelper.fillString("+"+points.toFixed(0), x, y);
        CanvasHelper.fillString(this.reactTimes[this.reactTimes.length-1]+" ms", x-10, y+15);
        setTimeout(() => {
            CanvasHelper.setFillColor(CanvasHelper.BG_COLOR);
            CanvasHelper.fillRectangle(x-15, y-30, 60, 55);
        }, 1000);
    }

    resizeTargets(lifetime : number, delta : number) {
        for(let i = 0; i < this.activeTargets.length; i++) {
            let target = this.activeTargets[i];
            
            if (target == undefined) {
                continue;
            }
            // Erase target from canvas.
            this.eraseTarget(target);
            let now = Date.now();
            let targetLifetime = now - target.timeCreated;
            if (targetLifetime > lifetime/2) {
                // Target should shrink.
                if (targetLifetime >= lifetime) {
                    target.timeCreated = now;
                }
                target.d -= delta;
            }
            else {
                // Target should grow.
                target.d += delta;
            }
            // Re-draw target with new size.
            this.drawTarget(target);
            
        };
    }

    calculateMetrics() {
        this.accuracy = (this.targetsHit/this.totalClicks) * 100
        let reactSum = 0;
        this.reactTimes.forEach((v, i, a) => {
            reactSum += v;
        });
        if(reactSum == 0) 
            this.avgReactTime = 0;
        else 
            this.avgReactTime = reactSum / this.reactTimes.length;
    }

    protected drawMetrics() {
        let scoreLabel = $("#metric-score").get(0) as HTMLParagraphElement;
        let accuracyLabel = $("#metric-accuracy").get(0) as HTMLParagraphElement;
        let scoreReact = $("#metric-react-time").get(0) as HTMLParagraphElement;
        scoreLabel.textContent = "Score: " + this.score.toFixed(0);
        accuracyLabel.textContent = "Accuracy: " + this.accuracy.toPrecision(4) + "%";
        scoreReact.textContent = "Avg Reaction Time: " + this.avgReactTime.toFixed(0) + " ms.";
    }

    protected redraw() {
        CanvasHelper.eraseAll();
        this.activeTargets.forEach(target => {
            this.drawTarget(target);
        });
    }
    
    abstract gameLoop() : void;
}