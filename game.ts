export abstract class Game {
    name: string;
    constructor(name:string) {
        this.name = name
        this.init();
    }

    init() {
        document.getElementById("canvas").display = "block";
    }
}