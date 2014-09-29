// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview MockUserAgent overrides goog.userAgent.getUserAgentString()
***REMOVED***     depending on a specified configuration.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.MockUserAgent');

goog.require('goog.Disposable');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Class for unit testing code that uses goog.userAgent.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
***REMOVED***
goog.testing.MockUserAgent = function() {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The userAgent string used by goog.userAgent.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.userAgent_ = goog.userAgent.getUserAgentString();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The original goog.userAgent.getUserAgentString function.
  ***REMOVED*** @type {function():?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.originalUserAgentFunction_ = goog.userAgent.getUserAgentString;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The navigator object used by goog.userAgent
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.navigator_ = goog.userAgent.getNavigator();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The original goog.userAgent.getNavigator function
  ***REMOVED*** @type {function():Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.originalNavigatorFunction_ = goog.userAgent.getNavigator;
***REMOVED***
goog.inherits(goog.testing.MockUserAgent, goog.Disposable);


***REMOVED***
***REMOVED*** Whether this MockUserAgent has been installed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MockUserAgent.prototype.installed_;


***REMOVED***
***REMOVED*** Installs this MockUserAgent.
***REMOVED***
goog.testing.MockUserAgent.prototype.install = function() {
  if (!this.installed_) {
    goog.userAgent.getUserAgentString =
        goog.bind(this.getUserAgentString, this);
    goog.userAgent.getNavigator = goog.bind(this.getNavigator, this);
    this.installed_ = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The userAgent set in this class.
***REMOVED***
goog.testing.MockUserAgent.prototype.getUserAgentString = function() {
  return this.userAgent_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} userAgent The desired userAgent string to use.
***REMOVED***
goog.testing.MockUserAgent.prototype.setUserAgentString = function(userAgent) {
  this.userAgent_ = userAgent;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Object} The Navigator set in this class.
***REMOVED***
goog.testing.MockUserAgent.prototype.getNavigator = function() {
  return this.navigator_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {Object} navigator The desired Navigator object to use.
***REMOVED***
goog.testing.MockUserAgent.prototype.setNavigator = function(navigator) {
  this.navigator_ = navigator;
***REMOVED***


***REMOVED***
***REMOVED*** Uninstalls the MockUserAgent.
***REMOVED***
goog.testing.MockUserAgent.prototype.uninstall = function() {
  if (this.installed_) {
    goog.userAgent.getUserAgentString = this.originalUserAgentFunction_;
    goog.userAgent.getNavigator = this.originalNavigatorFunction_;
    this.installed_ = false;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.MockUserAgent.prototype.disposeInternal = function() {
  this.uninstall();
  delete this.userAgent_;
  delete this.originalUserAgentFunction_;
  delete this.navigator_;
  delete this.originalNavigatorFunction_;
  goog.testing.MockUserAgent.superClass_.disposeInternal.call(this);
***REMOVED***