// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Base class that implements functionality common
***REMOVED*** across both session and local web storage mechanisms.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.mechanism.HTML5WebStorage');

goog.require('goog.asserts');
goog.require('goog.iter.Iterator');
goog.require('goog.iter.StopIteration');
goog.require('goog.storage.mechanism.ErrorCode');
goog.require('goog.storage.mechanism.IterableMechanism');



***REMOVED***
***REMOVED*** Provides a storage mechanism that uses HTML5 Web storage.
***REMOVED***
***REMOVED*** @param {Storage} storage The Web storage object.
***REMOVED***
***REMOVED*** @extends {goog.storage.mechanism.IterableMechanism}
***REMOVED***
goog.storage.mechanism.HTML5WebStorage = function(storage) {
  goog.base(this);
  this.storage_ = storage;
***REMOVED***
goog.inherits(goog.storage.mechanism.HTML5WebStorage,
              goog.storage.mechanism.IterableMechanism);


***REMOVED***
***REMOVED*** The key used to check if the storage instance is available.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.storage.mechanism.HTML5WebStorage.STORAGE_AVAILABLE_KEY_ = '__sak';


***REMOVED***
***REMOVED*** The web storage object (window.localStorage or window.sessionStorage).
***REMOVED***
***REMOVED*** @type {Storage}
***REMOVED*** @private
***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.storage_;


***REMOVED***
***REMOVED*** Determines whether or not the mechanism is available.
***REMOVED*** It works only if the provided web storage object exists and is enabled.
***REMOVED***
***REMOVED*** @return {boolean} True if the mechanism is available.
***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.isAvailable = function() {
  if (!this.storage_) {
    return false;
  }
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    // setItem will throw an exception if we cannot access WebStorage (e.g.,
    // Safari in private mode).
    this.storage_.setItem(
        goog.storage.mechanism.HTML5WebStorage.STORAGE_AVAILABLE_KEY_, '1');
    this.storage_.removeItem(
        goog.storage.mechanism.HTML5WebStorage.STORAGE_AVAILABLE_KEY_);
    return true;
  } catch (e) {
    return false;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.set = function(key, value) {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    // May throw an exception if storage quota is exceeded.
    this.storage_.setItem(key, value);
  } catch (e) {
    // In Safari Private mode, conforming to the W3C spec, invoking
    // Storage.prototype.setItem will allways throw a QUOTA_EXCEEDED_ERR
    // exception.  Since it's impossible to verify if we're in private browsing
    // mode, we throw a different exception if the storage is empty.
    if (this.storage_.length == 0) {
      throw goog.storage.mechanism.ErrorCode.STORAGE_DISABLED;
    } else {
      throw goog.storage.mechanism.ErrorCode.QUOTA_EXCEEDED;
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.get = function(key) {
  // According to W3C specs, values can be of any type. Since we only save
  // strings, any other type is a storage error. If we returned nulls for
  // such keys, i.e., treated them as non-existent, this would lead to a
  // paradox where a key exists, but it does not when it is retrieved.
  // http://www.w3.org/TR/2009/WD-webstorage-20091029/#the-storage-interface
  var value = this.storage_.getItem(key);
  if (!goog.isString(value) && !goog.isNull(value)) {
    throw goog.storage.mechanism.ErrorCode.INVALID_VALUE;
  }
  return value;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.remove = function(key) {
  this.storage_.removeItem(key);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.getCount = function() {
  return this.storage_.length;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.__iterator__ = function(
    opt_keys) {
  var i = 0;
  var storage = this.storage_;
  var newIter = new goog.iter.Iterator();
  newIter.next = function() {
    if (i >= storage.length) {
      throw goog.iter.StopIteration;
    }
    var key = goog.asserts.assertString(storage.key(i++));
    if (opt_keys) {
      return key;
    }
    var value = storage.getItem(key);
    // The value must exist and be a string, otherwise it is a storage error.
    if (!goog.isString(value)) {
      throw goog.storage.mechanism.ErrorCode.INVALID_VALUE;
    }
    return value;
 ***REMOVED*****REMOVED***
  return newIter;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.clear = function() {
  this.storage_.clear();
***REMOVED***


***REMOVED***
***REMOVED*** Gets the key for a given key index. If an index outside of
***REMOVED*** [0..this.getCount()) is specified, this function returns null.
***REMOVED*** @param {number} index A key index.
***REMOVED*** @return {?string} A storage key, or null if the specified index is out of
***REMOVED***     range.
***REMOVED***
goog.storage.mechanism.HTML5WebStorage.prototype.key = function(index) {
  return this.storage_.key(index);
***REMOVED***