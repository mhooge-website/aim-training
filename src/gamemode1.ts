import { Game } from "./game";
import { CanvasHelper } from "./canvashelper";
import { Target } from "./target";

export class GameHoldAngle extends Game {
    private wallHeight = 200;
    private wallWidth = 20;
    private maxPeekLength = 200;
    private peekCircleDiameter = 80;
    private peekSpeedMS = 500;
    private currentTarget : Target;

    constructor(name:string) {
        super(name);
    }

    init() {
        super.init();
        this.gameLoop();
    }

    createTarget(x : number, y: number, d : number) {
        let target = new Target(x, y, d);
        this.canvas.addEventListener("click", () => {

        });
        return target;
    }

    calculateHeadSize(y : number, scale : number) {
        let headTop = (y + ((this.wallHeight * scale) / 2)) - (this.peekCircleDiameter * scale / 2);
        let headBottom = (y + ((this.wallHeight * scale) / 2)) + (this.peekCircleDiameter * scale / 2);
        return { top: headTop, bot: headBottom };
    }

    drawWallMarkers(x : number, yTop : number, yBot : number) {
        CanvasHelper.setStrokeColor("rgb(255, 0, 0)");
        let xShift = x > this.canvas.width/2 ? 40 : -40;
        CanvasHelper.drawLine(x+xShift, yTop, x, yTop);
        CanvasHelper.drawLine(x+xShift, yBot, x, yBot);
    }

    drawWall(x : number, y : number, scale : number) {
        CanvasHelper.setFillColor("rgb(0, 0, 0)");
        CanvasHelper.fillRectangle(x, y, this.wallWidth*scale, this.wallHeight*scale);
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
        let shiftX = diameter/2;
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
            let headY = target.y + (diameter/2);
            this.redraw(x, y, target.y, target.y + target.d, scale);
            this.drawHead(headX, headY, diameter);
            count++;
            if (count > frames) clearInterval(id);
        }, this.peekSpeedMS/maxFrames);
    }

    redraw(x : number, y : number, yTop : number, yBot : number, scale : number) {
        CanvasHelper.eraseAll(this.canvas);
        this.drawWall(x, y, scale);
        this.drawWallMarkers(x, yTop, yBot);
    }

    drawPeekCountdown(count:number, x:number, y:number) {
        setTimeout(
            () => {
                CanvasHelper.setFillColor("rgb(255, 255, 255)");
                CanvasHelper.fillString((count+1)+"!", x, y);
                CanvasHelper.setFillColor("rgb(0, 0, 0)");
                CanvasHelper.fillString(count+"!", x, y);

                if (count > 1) this.drawPeekCountdown(count-1, x, y);
            }
        , 1000);
    }

    getPeekPosition() {
        let x = Math.random() * this.canvas.width;
        let y = Math.random() * this.canvas.height;
        let scale = Math.random();
        if (scale < 0.2) scale = 0.2;
        
        if (x + this.wallWidth > this.canvas.width) x = this.canvas.width - this.wallWidth
        if (y + this.wallHeight > this.canvas.height) y = this.canvas.height - this.wallHeight

        return { x: x, y: y, scale: scale }
    }

    gameLoop() {
        let pos = this.getPeekPosition();
        let headPos = this.calculateHeadSize(pos.y, pos.scale);
        this.drawWall(pos.x, pos.y, pos.scale);
        this.drawWallMarkers(pos.x, headPos.top, headPos.bot);
        CanvasHelper.setFont("24px serif");
        this.drawPeekCountdown(3, pos.x, pos.y-5);
        let targetDiameter = headPos.bot - headPos.top;
        setTimeout(() => {
            this.currentTarget = this.createTarget(pos.x - targetDiameter/2, headPos.bot, targetDiameter);
            this.animatePeek(pos.x, pos.y, this.currentTarget, pos.scale);
        }, 4000)
    }
}