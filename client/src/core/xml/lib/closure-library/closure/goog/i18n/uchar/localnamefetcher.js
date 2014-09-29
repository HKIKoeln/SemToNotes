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
***REMOVED*** @fileoverview Object which fetches Unicode codepoint names that are locally
***REMOVED*** stored in a bundled database. Currently, only invisible characters are
***REMOVED*** covered by this database. See the goog.i18n.uChar.RemoteNameFetcher class for
***REMOVED*** a remote database option.
***REMOVED***

goog.provide('goog.i18n.uChar.LocalNameFetcher');

goog.require('goog.debug.Logger');
goog.require('goog.i18n.uChar');
goog.require('goog.i18n.uChar.NameFetcher');



***REMOVED***
***REMOVED*** Builds the NameFetcherLocal object. This is a simple object which retrieves
***REMOVED*** character names from a local bundled database. This database only covers
***REMOVED*** invisible characters. See the goog.i18n.uChar class for more details.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.i18n.uChar.NameFetcher}
***REMOVED***
goog.i18n.uChar.LocalNameFetcher = function() {
***REMOVED***


***REMOVED***
***REMOVED*** A reference to the LocalNameFetcher logger.
***REMOVED***
***REMOVED*** @type {!goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.LocalNameFetcher.logger_ =
    goog.debug.Logger.getLogger('goog.i18n.uChar.LocalNameFetcher');


***REMOVED*** @override***REMOVED***
goog.i18n.uChar.LocalNameFetcher.prototype.prefetch = function(character) {
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.i18n.uChar.LocalNameFetcher.prototype.getName = function(character,
    callback) {
  var localName = goog.i18n.uChar.toName(character);
  if (!localName) {
    goog.i18n.uChar.LocalNameFetcher.logger_.
        warning('No local name defined for character ' + character);
  }
  callback(localName);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.i18n.uChar.LocalNameFetcher.prototype.isNameAvailable = function(
    character) {
  return !!goog.i18n.uChar.toName(character);
***REMOVED***