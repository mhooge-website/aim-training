import * as $ from "jquery";
import { CanvasHelper} from "./canvashelper";

export abstract class Game {
    protected name: string;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D

    constructor(name:string) {
        this.name = name;
    }

    init() {
        this.canvas = $("canvas").get(0) as HTMLCanvasElement;
        this.canvas.style.display = "block";
        this.canvas.width = window.innerWidth * 0.9;
        this.canvas.height = window.innerHeight * 0.7;
        this.ctx = this.canvas.getContext("2d");
        CanvasHelper.setHelperContext(this.ctx);
    }

    abstract gameLoop() : void;
}