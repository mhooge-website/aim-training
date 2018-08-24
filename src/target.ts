export class Target {
    x : number;
    y : number;
    d : number;
    color : string;
    timeCreated : number;

    constructor(x : number, y : number, d : number, color = "rgb(255, 0, 0)") {
        this.x = x;
        this.y = y;
        this.d = d;
        this.color = color;
        this.timeCreated = new Date().getTime();
    }

    contains(xPos : number, yPos : number) {
        return Math.pow(xPos-this.x, 2) + Math.pow(yPos-this.y, 2) < Math.pow(this.d/2, 2);
    }

    toString() {
        return "Target - x: " + this.x + ", y: " + this.y + ", d: " + this.d + ", color: " + this.color;
    }
}