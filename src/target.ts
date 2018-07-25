export class Target {
    x : number;
    y : number;
    d : number;

    constructor(x : number, y : number, d : number) {
        this.x = x;
        this.y = y;
        this.d = d;
    }

    contains(xPos : number, yPos : number) {
        return Math.pow(this.x - xPos, 2) + Math.pow(this.y - yPos, 2) < Math.pow(this.d/2, 2);
    }
}