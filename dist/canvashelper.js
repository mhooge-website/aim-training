var drawCtx;
function setStrokeColor(color) {
    drawCtx.strokeStyle = color;
}
function setFillColor(color) {
    drawCtx.fillStyle = color;
}
function setFont(font) {
    drawCtx.font = font;
}
function fillString(s, x, y) {
    drawCtx.fillText(s, x, y);
}
function fillCircle(x, y, d) {
    circlePath(x, y, d);
    drawCtx.fill();
}
function drawCircle(x, y, d) {
    circlePath(x, y, d);
    drawCtx.stroke();
}
function circlePath(x, y, d) {
    drawCtx.beginPath();
    drawCtx.arc(x, y, d, 0, Math.PI * 2, true);
}
function drawLine(x1, y1, x2, y2) {
    drawCtx.beginPath();
    drawCtx.moveTo(x1, y1);
    drawCtx.lineTo(x2, y2);
    drawCtx.stroke();
}
function drawRectangle(x, y, w, h) {
    drawCtx.strokeRect(x, y, w, h);
}
function fillRectangle(x, y, w, h) {
    drawCtx.fillRect(x, y, w, h);
}
function eraseAll(canvas) {
    drawCtx.fillStyle = "rgb(255, 255, 255)";
    drawCtx.fillRect(0, 0, canvas.width, canvas.height);
}
function setHelperContext(ctx) {
    drawCtx = ctx;
}
