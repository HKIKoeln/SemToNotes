/**
 * @fileoverview SVG super class.
 */

goog.provide('xrx.svg.Element');



goog.require('xrx.engine.Element');



/**
 * SVG super class.
 * @param {SVGElement} element An SVG element.
 * @constructor
 */
xrx.svg.Element = function(element) {

  goog.base(this);

  /**
   * The SVG element.
   * @type {SVGElement}
   */
  this.element_ = element;
};
goog.inherits(xrx.svg.Element, xrx.engine.Element);



/**
 * Returns the SVG element.
 * @return {SVGElement} The SVG element.
 */
xrx.svg.Element.prototype.getElement = function() {
  return this.element_;
};



xrx.svg.Element.prototype.applyTransform = function(matrix) {
  if (!matrix) return;
  var s = 'matrix(' + matrix.m00_ + ',' + matrix.m10_ +
      ',' + matrix.m01_ + ',' + matrix.m11_ +
      ',' + matrix.m02_ + ',' + matrix.m12_ + ')';
  this.element_.setAttribute('transform', s); 
};