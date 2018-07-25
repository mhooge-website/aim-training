"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var game_1 = require("./game");
var GameHoldAngle = (function (_super) {
    __extends(GameHoldAngle, _super);
    function GameHoldAngle(name) {
        var _this = _super.call(this, name) || this;
        _this.wallHeight = 200;
        _this.wallWidth = 20;
        _this.maxPeekLength = 200;
        _this.peekCircleDiameter = 40;
        return _this;
    }
    GameHoldAngle.prototype.init = function () {
        _super.prototype.init.call(this);
        this.gameLoop();
    };
    GameHoldAngle.prototype.drawWall = function (x, y) {
        setFillColor("rgb(0, 0, 0)");
        fillRectangle(x, y, this.wallWidth, this.wallHeight);
    };
    GameHoldAngle.prototype.getPeekEndpoint = function () {
        return Math.random() * this.maxPeekLength + (this.peekCircleDiameter / 2);
    };
    GameHoldAngle.prototype.animatePeek = function (x, y) {
    };
    GameHoldAngle.prototype.drawPeekCountdown = function (count, x, y) {
        var _this = this;
        setTimeout(function () {
            setFillColor("rgb(255, 255, 255)");
            fillString((count + 1) + "!", x, y);
            setFillColor("rgb(0, 0, 0)");
            fillString(count + "!", x, y);
            if (count > 1)
                _this.drawPeekCountdown(count - 1, x, y);
        }, 1000);
    };
    GameHoldAngle.prototype.getPeekPosition = function () {
        var x = Math.random() * this.canvas.width;
        var y = Math.random() * this.canvas.height;
        if (x > this.canvas.width)
            x = this.canvas.width - this.wallWidth;
        if (y > this.canvas.height)
            y = this.canvas.height - this.wallHeight;
        return { x: x, y: y };
    };
    GameHoldAngle.prototype.gameLoop = function () {
        var _this = this;
        var pos = this.getPeekPosition();
        this.drawWall(pos.x, pos.y);
        this.drawPeekCountdown(3, pos.x, pos.y);
        setTimeout(function () {
            return _this.animatePeek(pos.x, pos.y);
        }, 1000);
    };
    return GameHoldAngle;
}(game_1.Game));
exports.GameHoldAngle = GameHoldAngle;
