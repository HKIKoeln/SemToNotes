// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Mock matchers for event related arguments.
***REMOVED***

goog.provide('goog.testing.events.EventMatcher');

goog.require('goog.events.Event');
goog.require('goog.testing.mockmatchers.ArgumentMatcher');



***REMOVED***
***REMOVED*** A matcher that verifies that an argument is a {@code goog.events.Event} of a
***REMOVED*** particular type.
***REMOVED*** @param {string} type The single type the event argument must be of.
***REMOVED***
***REMOVED*** @extends {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.events.EventMatcher = function(type) {
  goog.testing.mockmatchers.ArgumentMatcher.call(this,
      function(obj) {
        return obj instanceof goog.events.Event &&
            obj.type == type;
      }, 'isEventOfType(' + type + ')');
***REMOVED***
goog.inherits(goog.testing.events.EventMatcher,
    goog.testing.mockmatchers.ArgumentMatcher);