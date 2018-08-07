import { Game } from "./game";
import { CanvasHelper } from "./canvashelper";
import { Target } from "./target";
import { Countdown } from "./countdown";

export class GameHoldAngle extends Game {
    private wallWidth = 20;
    private maxPeekLength = 200;
    private peekCircleDiameter = 80;
    private peekSpeedMS = 200;

    constructor(name:string) {
        super(name);
    }

    init() {
        super.init();
        this.gameLoop();
    }

    calculateHeadSize(scale : number) {
        let headRadius = (this.peekCircleDiameter * scale) / 2;
        let headTop = (this.canvas.height / 2) - headRadius;
        let headBottom = (this.canvas.height / 2) + headRadius;
        return { top: headTop, bot: headBottom };
    }

    drawWallMarkers(x : number, yTop : number, yBot : number) {
        CanvasHelper.setStrokeColor("rgb(255, 0, 0)");
        let xShift = x > this.canvas.width/2 ? 40 : -40;
        CanvasHelper.drawLine(x+xShift, yTop, x, yTop);
        CanvasHelper.drawLine(x+xShift, yBot, x, yBot);
    }

    drawWall(x : number, scale : number) {
        CanvasHelper.setFillColor("rgb(0, 0, 0)");
        CanvasHelper.fillRectangle(x, 0, this.wallWidth*scale, this.canvas.height);
    }

    getPeekLength() {
        return Math.random() * this.maxPeekLength + (this.peekCircleDiameter / 2);
    }

    drawHead(x : number, y : number, d : number) {
        CanvasHelper.setFillColor("rgb(255, 0, 0)");
        CanvasHelper.fillCircle(x, y, d/2);
    }

    animatePeek(x:number, y : number, target : Target, scale : number) {
        let peekLength = this.getPeekLength();
        let dir = -1
        let diameter = target.d;
        let shiftX = diameter;
        if (x < this.canvas.width/2) {
            dir = 1;
            shiftX = shiftX * -1;
        }
        shiftX = x + shiftX
        let maxFrames = 20
        let frames = maxFrames * peekLength/this.maxPeekLength;
        let count = 1;
        let id = setInterval(() => {
            let stepX = (peekLength * (count/frames)) * dir;
            let headX = shiftX + stepX
            let topY = target.y - (diameter/2);
            this.activeTargets[0].x = headX;
            this.eraseInfrontOfWall(x);
            this.redraw(x, y, topY, topY + target.d, scale);
            this.drawHead(headX, target.y, diameter);
            this.eraseBehindWall(x);
            this.redraw(x, y, topY, topY + target.d, scale);
            count++;
            if (count > frames || this.activeTargets.length == 0) clearInterval(id);
        }, (this.peekSpeedMS/maxFrames)/scale);
    }

    eraseInfrontOfWall(x : number) {
        CanvasHelper.setFillColor("rgb(255, 255, 255)");
        if (x > this.canvas.width / 2) {
            CanvasHelper.fillRectangle(0, 0, x, this.canvas.height);
        }
        else if (x < this.canvas.width / 2) {
            CanvasHelper.fillRectangle(x, 0, this.canvas.width, this.canvas.height);
        }
    }

    eraseBehindWall(x : number) {
        CanvasHelper.setFillColor("rgb(255, 255, 255)");
        if (x < this.canvas.width / 2) {
            CanvasHelper.fillRectangle(0, 0, x, this.canvas.height);
        }
        else if (x > this.canvas.width / 2) {
            CanvasHelper.fillRectangle(x, 0, this.canvas.width, this.canvas.height);
        }
    }

    redraw(x : number, y : number, yTop : number, yBot : number, scale : number) {
        this.drawWall(x, scale);
        this.drawWallMarkers(x, yTop, yBot);
        this.drawMetrics();
    }

    getPeekPosition() {
        let x = Math.random() * this.canvas.width;
        let scale = Math.random();
        if (scale < 0.2) scale = 0.2;
        
        if (x + this.wallWidth > this.canvas.width) x = this.canvas.width - this.wallWidth

        return { x: x, scale: scale }
    }

    targetHit(target : Target) {
        super.targetHit(target);
        CanvasHelper.eraseAll(this.canvas);
        
        this.activeTargets = [];
        let multiplier = this.reactTimes[this.reactTimes.length-1] > 1000 ? 1 : 1000/this.reactTimes[this.reactTimes.length-1];
        this.score += multiplier;
        
        super.drawPointsForHit(target, multiplier);
        this.gameLoop();
    }

    gameLoop() {
        let peekPos = this.getPeekPosition();
        let headPos = this.calculateHeadSize(peekPos.scale);
        this.drawWall(peekPos.x, peekPos.scale);
        this.drawWallMarkers(peekPos.x, headPos.top, headPos.bot);
        Countdown.createCountdown(peekPos.x+this.wallWidth+5, headPos.top - 10);
        let targetDiameter = headPos.bot - headPos.top;
        setTimeout(() => {
            this.activeTargets = [this.createTarget(peekPos.x - targetDiameter/2, headPos.top + targetDiameter/2, targetDiameter)];
            this.animatePeek(peekPos.x, headPos.top, this.activeTargets[0], peekPos.scale);
        }, 4000)
    }
}