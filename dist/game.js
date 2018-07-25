"use strict";
exports.__esModule = true;
var Game = (function () {
    function Game(name) {
        this.name = name;
    }
    Game.prototype.init = function () {
        this.canvas = document.getElementById("canvas");
        this.canvas.style.display = "block";
        this.ctx = this.canvas.getContext("2d");
        setHelperContext(this.ctx);
    };
    return Game;
}());
exports.Game = Game;
