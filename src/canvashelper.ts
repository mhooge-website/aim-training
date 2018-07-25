export class CanvasHelper {
    static drawCtx : CanvasRenderingContext2D;

    static setStrokeColor(color : string) {
        this.drawCtx.strokeStyle = color;
    }

    static setFillColor(color : string) {
        this.drawCtx.fillStyle = color;
    }

    static setFont(font : string) {
        this.drawCtx.font = font;
    }

    static fillString(s : string, x : number, y : number) {
        this.drawCtx.fillText(s, x, y);
    }

    static fillCircle(x : number, y : number, d : number) {
        this.circlePath(x, y, d);
        this.drawCtx.fill();
    }

    static drawCircle(x : number, y : number, d : number) {
        this.circlePath(x, y, d);
        this.drawCtx.stroke();
    }

    static circlePath(x : number, y : number, d : number) {
        this.drawCtx.beginPath();
        this.drawCtx.arc(x, y, d, 0, Math.PI * 2, true);
    }

    static drawLine(x1 : number, y1 : number, x2 : number, y2 : number) {
        this.drawCtx.beginPath();
        this.drawCtx.moveTo(x1, y1);
        this.drawCtx.lineTo(x2, y2);
        this.drawCtx.stroke();
    }

    static drawRectangle(x : number, y : number, w : number, h : number) {
        this.drawCtx.strokeRect(x, y, w, h);
    }

    static fillRectangle(x : number, y : number, w : number, h : number) {
        this.drawCtx.fillRect(x, y, w, h);
    }

    static eraseAll(canvas : HTMLCanvasElement) {
        this.drawCtx.fillStyle = "rgb(255, 255, 255)";
        this.drawCtx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }

    static setHelperContext(ctx : CanvasRenderingContext2D) {
        this.drawCtx = ctx;
    }

    static getRelativePos(xPos : number, yPos : number, canvas : HTMLCanvasElement) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: xPos - rect.left,
            y: yPos - rect.top
        };
    }
}