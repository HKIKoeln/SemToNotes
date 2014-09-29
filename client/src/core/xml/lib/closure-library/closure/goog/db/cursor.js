// Copyright 2012 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Wrapper for a IndexedDB cursor.
***REMOVED***
***REMOVED***


goog.provide('goog.db.Cursor');

goog.require('goog.async.Deferred');
goog.require('goog.db.Error');
goog.require('goog.debug');
goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Creates a new IDBCursor wrapper object. Should not be created directly,
***REMOVED*** access cursor through object store.
***REMOVED*** @see goog.db.ObjectStore#openCursor
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.db.Cursor = function() {
  goog.base(this);
***REMOVED***
goog.inherits(goog.db.Cursor, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Underlying IndexedDB cursor object.
***REMOVED***
***REMOVED*** @type {IDBCursor}
***REMOVED*** @private
***REMOVED***
goog.db.Cursor.prototype.cursor_ = null;


***REMOVED***
***REMOVED*** Advances the cursor to the next position along its direction. When new data
***REMOVED*** is available, the NEW_DATA event will be fired. If the cursor has reached the
***REMOVED*** end of the range it will fire the COMPLETE event. If opt_key is specified it
***REMOVED*** will advance to the key it matches in its direction.
***REMOVED***
***REMOVED*** This wraps the native #continue method on the underlying object.
***REMOVED***
***REMOVED*** @param {IDBKeyType=} opt_key The optional key to advance to.
***REMOVED***
goog.db.Cursor.prototype.next = function(opt_key) {
  if (opt_key) {
    this.cursor_['continue'](opt_key);
  } else {
    this.cursor_['continue']();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the value at the current position of the cursor in the object store.
***REMOVED*** If the cursor points to a value that has just been deleted, a new value is
***REMOVED*** created.
***REMOVED***
***REMOVED*** @param {*} value The value to be stored.
***REMOVED*** @return {!goog.async.Deferred} The resulting deferred request.
***REMOVED***
goog.db.Cursor.prototype.update = function(value) {
  var msg = 'updating via cursor with value ';
  var d = new goog.async.Deferred();
  var request;

  try {
    request = this.cursor_.update(value);
  } catch (err) {
    msg += goog.debug.deepExpose(value);
    d.errback(goog.db.Error.fromException(err, msg));
    return d;
  }
  request.onsuccess = function(ev) {
    d.callback();
 ***REMOVED*****REMOVED***
  request.onerror = function(ev) {
    msg += goog.debug.deepExpose(value);
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Deletes the value at the cursor's position, without changing the cursor's
***REMOVED*** position. Once the value is deleted, the cursor's value is set to null.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The resulting deferred request.
***REMOVED***
goog.db.Cursor.prototype.remove = function() {
  var msg = 'deleting via cursor';
  var d = new goog.async.Deferred();
  var request;

  try {
    request = this.cursor_['delete']();
  } catch (err) {
    d.errback(goog.db.Error.fromException(err, msg));
    return d;
  }
  request.onsuccess = function(ev) {
    d.callback();
 ***REMOVED*****REMOVED***
  request.onerror = function(ev) {
    d.errback(goog.db.Error.fromRequest(ev.target, msg));
 ***REMOVED*****REMOVED***
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** @return {*} The value for the value at the cursor's position. Undefined
***REMOVED***     if no current value, or null if value has just been deleted.
***REMOVED***
goog.db.Cursor.prototype.getValue = function() {
  return this.cursor_['value'];
***REMOVED***


***REMOVED***
***REMOVED*** @return {IDBKeyType} The key for the value at the cursor's position. If
***REMOVED***     the cursor is outside its range, this is undefined.
***REMOVED***
goog.db.Cursor.prototype.getKey = function() {
  return this.cursor_.key;
***REMOVED***


***REMOVED***
***REMOVED*** Possible cursor directions.
***REMOVED*** @see http://www.w3.org/TR/IndexedDB/#idl-def-IDBCursor
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.db.Cursor.Direction = {
  NEXT: 'next',
  NEXT_NO_DUPLICATE: 'nextunique',
  PREV: 'prev',
  PREV_NO_DUPLICATE: 'prevunique'
***REMOVED***


***REMOVED***
***REMOVED*** Event types that the cursor can dispatch. COMPLETE events are dispatched when
***REMOVED*** a cursor is depleted of values, a NEW_DATA event if there is new data
***REMOVED*** available, and ERROR if an error occurred.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.db.Cursor.EventType = {
  COMPLETE: 'c',
  ERROR: 'e',
  NEW_DATA: 'n'
***REMOVED***