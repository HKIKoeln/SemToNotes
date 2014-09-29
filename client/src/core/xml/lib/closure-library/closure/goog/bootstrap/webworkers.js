// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A bootstrap for dynamically requiring Closure within an HTML5
***REMOVED*** Web Worker context. To use this, first set CLOSURE_BASE_PATH to the directory
***REMOVED*** containing base.js (relative to the main script), then use importScripts to
***REMOVED*** load this file and base.js (in that order). After this you can use
***REMOVED*** goog.require for further imports.
***REMOVED***
***REMOVED*** @nocompile
***REMOVED***


***REMOVED***
***REMOVED*** Imports a script using the Web Worker importScript API.
***REMOVED***
***REMOVED*** @param {string} src The script source.
***REMOVED*** @return {boolean} True if the script was imported, false otherwise.
***REMOVED***
this.CLOSURE_IMPORT_SCRIPT = (function(global) {
  return function(src) {
    global['importScripts'](src);
    return true;
 ***REMOVED*****REMOVED***
})(this);