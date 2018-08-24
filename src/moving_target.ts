import { Target } from "./target";

export class MovingTarget extends Target {
    startX : number;
    startY : number;

    constructor(x : number, y : number, d : number, color = "rgb(255, 0, 0)") {
        super(x, y, d, color);
        this.startX = x;
        this.startY = y;
    }
}