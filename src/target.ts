export class Target {
    x : number;
    y : number;
    d : number;
    timeCreated : number;

    constructor(x : number, y : number, d : number) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.timeCreated = new Date().getTime();
    }

    contains(xPos : number, yPos : number) {
        return Math.pow(xPos-this.x, 2) + Math.pow(yPos-this.y, 2) < Math.pow(this.d/2, 2);
    }
}