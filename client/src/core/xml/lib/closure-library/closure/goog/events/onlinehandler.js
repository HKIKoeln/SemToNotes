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
***REMOVED*** @fileoverview This event handler will dispatch events when
***REMOVED*** {@code navigator.onLine} changes.  HTML5 defines two events, online and
***REMOVED*** offline that is fired on the window.  As of today 3 browsers support these
***REMOVED*** events: Firefox 3 (Gecko 1.9), Opera 9.5, and IE8.  If we have any of these
***REMOVED*** we listen to the 'online' and 'offline' events on the current window
***REMOVED*** object.  Otherwise we poll the navigator.onLine property to detect changes.
***REMOVED***
***REMOVED*** Note that this class only reflects what the browser tells us and this usually
***REMOVED*** only reflects changes to the File -> Work Offline menu item.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/onlinehandler.html
***REMOVED***

// TODO(arv): We should probably implement some kind of polling service and/or
// a poll for changes event handler that can be used to fire events when a state
// changes.

goog.provide('goog.events.OnlineHandler');
goog.provide('goog.events.OnlineHandler.EventType');

goog.require('goog.Timer');
goog.require('goog.events.BrowserFeature');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.net.NetworkStatusMonitor');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Basic object for detecting whether the online state changes.
***REMOVED***
***REMOVED*** @extends {goog.net.NetworkStatusMonitor}
***REMOVED***
goog.events.OnlineHandler = function() {
  goog.base(this);

  this.eventHandler_ = new goog.events.EventHandler(this);

  // Some browsers do not support navigator.onLine and therefore we don't
  // bother setting up events or timers.
  if (!goog.events.BrowserFeature.HAS_NAVIGATOR_ONLINE_PROPERTY) {
    return;
  }

  if (goog.events.BrowserFeature.HAS_HTML5_NETWORK_EVENT_SUPPORT) {
    var target =
        goog.events.BrowserFeature.HTML5_NETWORK_EVENTS_FIRE_ON_BODY ?
        document.body : window;
    this.eventHandler_.listen(target,
        [goog.events.EventType.ONLINE, goog.events.EventType.OFFLINE],
        this.handleChange_);
  } else {
    this.online_ = this.isOnline();
    this.timer_ = new goog.Timer(goog.events.OnlineHandler.POLL_INTERVAL_);
    this.eventHandler_.listen(this.timer_, goog.Timer.TICK, this.handleTick_);
    this.timer_.start();
  }
***REMOVED***
goog.inherits(goog.events.OnlineHandler, goog.net.NetworkStatusMonitor);


***REMOVED***
***REMOVED*** Enum for the events dispatched by the OnlineHandler.
***REMOVED*** @enum {string}
***REMOVED***
goog.events.OnlineHandler.EventType = goog.net.NetworkStatusMonitor.EventType;


***REMOVED***
***REMOVED*** The time to wait before checking the {@code navigator.onLine} again.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.events.OnlineHandler.POLL_INTERVAL_ = 250;


***REMOVED***
***REMOVED*** Stores the last value of the online state so we can detect if this has
***REMOVED*** changed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.events.OnlineHandler.prototype.online_;


***REMOVED***
***REMOVED*** The timer object used to poll the online state.
***REMOVED*** @type {goog.Timer}
***REMOVED*** @private
***REMOVED***
goog.events.OnlineHandler.prototype.timer_;


***REMOVED***
***REMOVED*** Event handler to simplify event listening.
***REMOVED*** @type {goog.events.EventHandler}
***REMOVED*** @private
***REMOVED***
goog.events.OnlineHandler.prototype.eventHandler_;


***REMOVED*** @override***REMOVED***
goog.events.OnlineHandler.prototype.isOnline = function() {
  return goog.events.BrowserFeature.HAS_NAVIGATOR_ONLINE_PROPERTY ?
      navigator.onLine : true;
***REMOVED***


***REMOVED***
***REMOVED*** Called every time the timer ticks to see if the state has changed and when
***REMOVED*** the online state changes the method handleChange_ is called.
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @private
***REMOVED***
goog.events.OnlineHandler.prototype.handleTick_ = function(e) {
  var online = this.isOnline();
  if (online != this.online_) {
    this.online_ = online;
    this.handleChange_(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when the online state changes.  This dispatches the
***REMOVED*** {@code ONLINE} and {@code OFFLINE} events respectively.
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @private
***REMOVED***
goog.events.OnlineHandler.prototype.handleChange_ = function(e) {
  var type = this.isOnline() ?
      goog.net.NetworkStatusMonitor.EventType.ONLINE :
      goog.net.NetworkStatusMonitor.EventType.OFFLINE;
  this.dispatchEvent(type);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.OnlineHandler.prototype.disposeInternal = function() {
  goog.events.OnlineHandler.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  delete this.eventHandler_;
  if (this.timer_) {
    this.timer_.dispose();
    delete this.timer_;
  }
***REMOVED***