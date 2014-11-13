/**
 * @fileoverview Helper class for class xrx.xml.Stream.
 */

goog.provide('xrx.xml.Reader');



xrx.xml.Reader = function(input) {



  this.input_ = input || '';



  this.pos_ = 0;



  this.length_ = input.length;
};



xrx.xml.Reader.prototype.first = function() {
  this.pos_ = 0;
};



xrx.xml.Reader.prototype.last = function() {
  this.pos_ = this.length_ - 1;
};



xrx.xml.Reader.prototype.set = function(pos) {
  this.pos_ = pos || 0;
};



xrx.xml.Reader.prototype.get = function() {
  return this.input_.charAt(this.pos_);
};



xrx.xml.Reader.prototype.input = function(xml) {
  if (xml) this.input_ = xml;
  return this.input_;
};



xrx.xml.Reader.prototype.pos = function() {
  return this.pos_;
};



xrx.xml.Reader.prototype.length = function() {
  return this.length_;
};



xrx.xml.Reader.prototype.finished = function() {
  return this.pos_ < 0 || this.pos_ > this.length_ ? true : false;
};



xrx.xml.Reader.prototype.next = function() {
  return this.input_.charAt(this.pos_++);
};



xrx.xml.Reader.prototype.previous = function() {
  return this.input_.charAt(this.pos_--);
};



xrx.xml.Reader.prototype.peek = function(i) {
  return this.input_.charAt(this.pos_ + (i || 0));
};



xrx.xml.Reader.prototype.forward = function(i) {
  this.pos_ += (i || 0);
};



xrx.xml.Reader.prototype.backward = function(i) {
  this.pos_ -= (i || 0);
};



xrx.xml.Reader.prototype.forwardInclusive = function(ch) {
  var i;
  for (i = 0;; i++) {
    if (this.peek(i) === ch) break;
  }
  this.forward(++i);
};



xrx.xml.Reader.prototype.forwardExclusive = function(ch) {
  var i;
  for (i = 0;; i++) {
    if (this.peek(i) === ch) break;
  }
  this.forward(i);
};



xrx.xml.Reader.prototype.backwardInclusive = function(ch) {
  var i;
  for (i = 0;; i++) {
    if (this.peek(-i) === ch) break;
  }
  this.backward(i);
};



xrx.xml.Reader.prototype.backwardExclusive = function(ch) {
  var i;
  for (i = 0;; i++) {
    if (this.peek(-i) === ch) break;
  }
  this.backward(--i);
};

