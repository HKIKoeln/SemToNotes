/**
 * @fileoverview 
 */

goog.provide('xrx.widget.ShapePolygon');
goog.provide('xrx.widget.ShapePolygonCoords');
goog.provide('xrx.widget.ShapePolygonInsert');



goog.require('goog.dom.dataset');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.mvc.Controller');
goog.require('xrx.shape.Polygon');
goog.require('xrx.widget.Shape');



/**
 * @constructor
 */
xrx.widget.ShapePolygon = function(element) {

  this.shapePolygonCoords_;

  this.shapePolygonInsert_;

  goog.base(this, element);
};
goog.inherits(xrx.widget.ShapePolygon, xrx.widget.Shape);
xrx.mvc.registerComponent('xrx-widget-shape-polygon', xrx.widget.ShapePolygon);



xrx.widget.ShapePolygon.prototype.mvcRefresh = function() {
  if (!this.getNode()) return;
  this.shapePolygonCoords_.refresh();
  this.getDrawing().draw();
};



xrx.widget.ShapePolygon.prototype.mvcRemove = function() {
  this.getDrawing().getLayerShape().removeShape(this.shape_);
  this.getDrawing().draw();
};



xrx.widget.ShapePolygon.prototype.mvcModelUpdateData = function() {
  this.shapePolygonCoords_.modelUpdateData();
};



xrx.widget.ShapePolygon.prototype.mvcModelDeleteData = function() {
  xrx.mvc.Controller.removeNode(this, this.getNode());
};



xrx.widget.ShapePolygon.prototype.mvcModelInsertData = function() {
  this.shapePolygonInsert_.modelInsertData();
};



xrx.widget.ShapePolygon.prototype.createDom = function() {
  var self = this;
  this.shape_ = xrx.shape.Polygon.create(this.getDrawing());
  if (this.getNode()) this.getDrawing().getLayerShape().addShapes(this.shape_);
  this.shapePolygonCoords_ = new xrx.widget.ShapePolygonCoords(this);
  this.shapePolygonInsert_ = new xrx.widget.ShapePolygonInsert(this);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    self.mvcModelUpdateData();
  }
  // handle delete component
  this.shape_.handleDeleted = function() {
    self.mvcModelDeleteData();
  }
};



/**
 * @constructor
 */
xrx.widget.ShapePolygonInsert = function(polygon) {

  this.polygon_ = polygon;

  goog.base(this, polygon.getElement());
};
goog.inherits(xrx.widget.ShapePolygonInsert, xrx.mvc.Component);



/**
 * @override
 */
xrx.widget.ShapePolygonInsert.prototype.getRefExpression = function() {
  return goog.dom.dataset.get(this.element_, 'xrxRefInsert');
};




xrx.widget.ShapePolygonInsert.prototype.modelInsertData = function() {

};



/**
 * @constructor
 */
xrx.widget.ShapePolygonCoords = function(polygon) {

  this.polygon_ = polygon;

  goog.base(this, polygon.getElement());
};
goog.inherits(xrx.widget.ShapePolygonCoords, xrx.mvc.Component);



/**
 * @override
 */
xrx.widget.ShapePolygonCoords.prototype.getRefExpression = function() {
  return goog.dom.dataset.get(this.element_, 'xrxRefCoords');
};



xrx.widget.ShapePolygonCoords.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var coords = this.polygon_.parseCoords(str);
  this.polygon_.getShape().setCoords(coords);
};



xrx.widget.ShapePolygonCoords.prototype.modelUpdateData = function(coords) {
  xrx.mvc.Controller.updateNodeValue(this.polygon_, this.getNode(),
      this.polygon_.serializeCoords(this.polygon_.getShape().getCoords()));
};
