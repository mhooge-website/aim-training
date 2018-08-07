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
    private targetsHit = 0;
    private totalClicks = 0;

    constructor(name:string) {
        this.name = name;
    }

    createTarget(x : number, y: number, d : number) {
        let pos = CanvasHelper.getRelativePos(x, y, this.canvas);
        console.log(pos.x + ", " + pos.y);
        console.log(x + ", " + y);
        let target = new Target(x, y, d);
        return target;
    }

    private addCanvasListener() {
        this.canvas.addEventListener("click", (e) => {
            this.totalClicks += 1;

            let pos = CanvasHelper.getRelativePos(e.clientX, e.clientY, this.canvas);
            for(let i = 0; i < this.activeTargets.length; i++) {
                console.log("Target: " + this.activeTargets[i].x + ", " + this.activeTargets[i].y)
                console.log("Click: " + pos.x + ", " + pos.y);
                console.log("Click: " + e.clientX + ", " + e.clientY);
                if (this.activeTargets[i].contains(pos.x, pos.y)) {
                    this.targetHit(this.activeTargets[i]);
                }
            }
            this.calculateMetrics();
            this.drawMetrics();
        });
    }
    
    init() {
        this.canvas = $("#canvas").get(0) as HTMLCanvasElement;
        let div = $("#game-div").get(0);
        div.style.display = "block";
        this.canvas.width = div.offsetWidth;
        this.canvas.height = div.offsetHeight
    
        CanvasHelper.setHelperContext(this.canvas.getContext("2d"));
        CanvasHelper.setFont("24px serif");
        this.addCanvasListener();
        this.drawMetrics();
    }

    targetHit(target : Target) {
        CanvasHelper.setFillColor("rgb(255, 255, 255)");
        CanvasHelper.fillCircle(target.x, target.y, target.d);
        
        this.targetsHit += 1;
        let timePassed = (new Date().getTime()) - target.timeCreated;
        this.reactTimes.push(timePassed);
    }

    drawPointsForHit(target : Target, points : number) {
        let x = target.x;
        let y = target.y-10;
        CanvasHelper.setFont("16px serif");
        CanvasHelper.setFillColor("rgb(0, 0, 0)");
        CanvasHelper.fillString("+"+points.toFixed(0), x, y);
        CanvasHelper.fillString(this.reactTimes[this.reactTimes.length-1]+" ms", x-10, y+15);
        setTimeout(() => {
            CanvasHelper.setFillColor("rgb(255, 255, 255)");
            CanvasHelper.fillRectangle(x-15, y-30, 60, 55);
        }, 1000);
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

    drawMetrics() {
        let scoreLabel = $("#metric-score").get(0) as HTMLParagraphElement;
        let accuracyLabel = $("#metric-accuracy").get(0) as HTMLParagraphElement;
        let scoreReact = $("#metric-react-time").get(0) as HTMLParagraphElement;
        scoreLabel.textContent = "Score: " + this.score.toFixed(0);
        accuracyLabel.textContent = "Accuracy: " + this.accuracy.toPrecision(4) + "%";
        scoreReact.textContent = "Avg Reaction Time: " + this.avgReactTime.toFixed(0) + " ms.";
    }
    
    abstract gameLoop() : void;
}