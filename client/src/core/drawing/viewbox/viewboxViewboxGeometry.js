/**
 * @fileoverview A class implementing geometry related
 * functions for a drawing view-box.
 */

goog.provide('xrx.viewbox.ViewboxGeometry');



goog.require('goog.array');
goog.require('goog.object');
goog.require('xrx.geometry.Box');
goog.require('xrx.geometry.Point');
goog.require('xrx.EventTarget');



/**
 * A class implementing geometry related functions for a drawing view-box.
 * @constructor
 * @private
 */
xrx.viewbox.ViewboxGeometry = function() {

  goog.base(this);

  this.testPoint_ = new Array(2);
};
goog.inherits(xrx.viewbox.ViewboxGeometry, xrx.EventTarget);



/**
 * Returns the width of this view-box, optionally the transformed
 * width (respecting the current scale) and / or the visible width
 * (respecting the current rotation).
 * @param {boolean} opt_transformed Whether to return the transformed
 *   width respecting the current scale.
 * @param {boolean} opt_visible Whether to return the visible width
 *   respecting the current rotation.
 * @return {number} The width.
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.getWidth = function(opt_transformed,
    opt_visible) {
  if (opt_visible === true && this.isHorizontal()) {
    return this.getHeight(opt_transformed);
  } else {
    var image = this.getDrawing().getLayerBackground().getImage();
    var width = image.getWidth();
    return !opt_transformed ? width : width * this.ctm_.getScale();
  }
};



/**
 * Returns the height of this view-box, optionally the transformed
 * height (respecting the current scale) and / or the visible height
 * (respecting the current rotation).
 * @param {boolean} opt_transformed Whether to return the transformed
 *   height respecting the current scale.
 * @param {boolean} opt_visible Whether to return the visible height
 *   respecting the current rotation.
 * @return {number} The height.
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.getHeight = function(opt_transformed, opt_visible) {
  if (opt_visible === true && this.isHorizontal()) {
    return this.getWidth(opt_transformed);
  } else {
    var image = this.getDrawing().getLayerBackground().getImage();
    var height = image.getHeight();
    return !opt_transformed ? height : height * this.ctm_.getScale();
  }
};



/**
 * Returns the bounding-box for this view-box, respecting transformation.
 * @return {goog.math.Box} The bounding box, coordinates are the visibles
 * and are transformed.
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.getBox = function() {
  var box;
  var rotation = this.getRotation();
  var transformed = new Array(4);
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth();
  var height = image.getHeight();
  var coords = [0, 0, width, height]
  this.ctm_.transform(coords, 0, transformed, 0, 4);
  if (rotation === 0) {
    box = [transformed[1], transformed[2], transformed[3], transformed[0]];
  } else if (rotation === 90) {
    box = [transformed[2], transformed[3], transformed[0], transformed[1]];
  } else if (rotation === 180) {
    box = [transformed[3], transformed[0], transformed[1], transformed[2]];
  } else {
    box = [transformed[0], transformed[1], transformed[2], transformed[3]];
  }
  return box;
};



/**
 * Whether a point is contained in this view-box.
 * @param {Array<number>} point The native point, without translation.
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.containsPoint = function(point) {
  var box = this.getBox();
  return xrx.geometry.Box.containsPoint(box, point);
};



/**
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.getCenterPoint_ = function(opt_transformed) {
  var image = this.getDrawing().getLayerBackground().getImage();
  var natural = [image.getWidth() / 2, image.getHeight() / 2];
  var transformed;
  if (opt_transformed !== true) {
    return natural;
  } else {
    transformed = new Array(2);
    this.ctm_.transform(natural, 0, transformed, 0, 1);
    return transformed;
  }
};



/**
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.getVisibleOrientation_ = function(orientation) {
  var orientations = ['NW', 'SW', 'SE', 'NE'];
  var index = goog.array.indexOf(orientations, orientation);
  var rotations = this.getRotation() / 90;
  return orientations[(index + rotations) % 4];
};



/**
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.FixPoints_ = {
  'C': [0, 0],
  'NE': [0, 0], 
  'SE': [0, 0],
  'SW': [0, 0],
  'NW': [0, 0]
};



/**
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.getFixPoints_ = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth();
  var height = image.getHeight();
  this.FixPoints_.C = [width / 2, height / 2];
  this.FixPoints_.NE = [width, 0];
  this.FixPoints_.SE = [width, height];
  this.FixPoints_.SW = [0, height];
  this.FixPoints_.NW = [0, 0];
  return this.FixPoints_;
};



/**
 * @private
 */
xrx.viewbox.ViewboxGeometry.prototype.getFixPoint_ = function(orientation,
    opt_transformed, opt_visible) {
  var fixPoints = this.getFixPoints_();
  var fixPoint = !opt_visible ? fixPoints[orientation] :
      fixPoints[this.getVisibleOrientation_(orientation)];
  if (opt_transformed === true) {
    var point = new Array(2);
    this.ctm_.transform(fixPoint, 0, point, 0, 1);
    return point;
  }
  return fixPoint;
};



/**
 * Disposes this view-box.
 */
xrx.viewbox.ViewboxGeometry.prototype.disposeInternal = function() {
  this.testPoint_ = null;
  goog.base(this, 'disposeInternal');
};
