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
    private targetsHit = 0;
    private totalClicks = 0;
    private reactTimes : number[] = [];

    constructor(name:string) {
        this.name = name;
    }

    createTarget(x : number, y: number, d : number) {
        let target = new Target(x, y, d);
        return target;
    }

    private addCanvasListener() {
        this.canvas.addEventListener("click", (e) => {
            this.totalClicks += 1;

            let pos = CanvasHelper.getRelativePos(e.clientX, e.clientY, this.canvas);
            for(let i = 0; i < this.activeTargets.length; i++) {
                if (this.activeTargets[i].contains(pos.x, pos.y)) {
                    this.targetHit(this.activeTargets[i]);
                }
            }
            this.calculateMetrics();
            this.drawMetrics();
        });
    }
    
    init() {
        this.canvas = $("canvas").get(0) as HTMLCanvasElement;
        this.canvas.style.display = "block";
        this.canvas.width = window.innerWidth * 0.9;
        this.canvas.height = window.innerHeight * 0.7;
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

    calculateMetrics() {
        this.accuracy = (this.targetsHit/this.totalClicks) * 100
        let reactSum = 0;
        this.reactTimes.forEach((v, i, a) => {
            reactSum += v;
        });
        this.avgReactTime = reactSum / this.reactTimes.length;
    }

    drawMetrics() {
        CanvasHelper.setFillColor("rgb(255, 255, 255)");
        CanvasHelper.fillRectangle(5, 5, 300, 80);
        CanvasHelper.setFillColor("rgb(0, 0, 0)");
        CanvasHelper.fillString("Score: " + this.score, 10, 20);
        CanvasHelper.fillString("Accuracy: " + this.accuracy.toPrecision(4) + "%", 10, 45);
        CanvasHelper.fillString("Avg Reaction Time: " + this.avgReactTime.toFixed(0) + " ms.", 10, 70);
    }
    
    abstract gameLoop() : void;
}