***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.canvas');



xrx.canvas = function() {***REMOVED***



xrx.canvas.getShapeSelected = function(e, shapes) {
  var selected;
  var ctx = shapes[0].getContext();
  var len = shapes.length;
  ctx.beginPath();
  for (var i = len - 1; i >= 0; i--) {
    shapes[i].drawPath();
    if (ctx.isPointInPath(e.offsetX, e.offsetY)) {
      selected = shapes[i];
      break;
    }
  }
  ctx.closePath();
  return selected;
***REMOVED***



xrx.canvas.setTransform = function(context, matrix) {
  context.setTransform(matrix.m00_, matrix.m10_, matrix.m01_,
      matrix.m11_, matrix.m02_, matrix.m12_);
***REMOVED***



xrx.canvas.getCoords = function(element) {
  return element.getCoords();
***REMOVED*** 



xrx.canvas.setCoords = function(element, coords) {
  element.setCoords(coords);
***REMOVED*** 



xrx.canvas.setCTM = function(element, affineTransform) {
  var c = element.getCanvas().getElementCanvas();
  var ctx = c.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, c.width, c.height);
  element.setTransform(affineTransform);
  element.draw();
***REMOVED***



xrx.canvas.getEventTarget = function(element) {
  return element.getCanvas().getElement();
***REMOVED***



goog.exportProperty(xrx, 'canvas', xrx.canvas);