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
***REMOVED*** @fileoverview Provides a 'paste' event detector that works consistently
***REMOVED*** across different browsers.
***REMOVED***
***REMOVED*** IE5, IE6, IE7, Safari3.0 and FF3.0 all fire 'paste' events on textareas.
***REMOVED*** FF2 doesn't. This class uses 'paste' events when they are available
***REMOVED*** and uses heuristics to detect the 'paste' event when they are not available.
***REMOVED***
***REMOVED*** Known issue: will not detect paste events in FF2 if you pasted exactly the
***REMOVED*** same existing text.
***REMOVED*** Known issue: Opera + Mac doesn't work properly because of the meta key. We
***REMOVED*** can probably fix that. TODO(user): {@link KeyboardShortcutHandler} does not
***REMOVED*** work either very well with opera + mac. fix that.
***REMOVED***
***REMOVED*** @supported IE5, IE6, IE7, Safari3.0, Chrome, FF2.0 (linux) and FF3.0 and
***REMOVED*** Opera (mac and windows).
***REMOVED***
***REMOVED*** @see ../demos/pastehandler.html
***REMOVED***

goog.provide('goog.events.PasteHandler');
goog.provide('goog.events.PasteHandler.EventType');
goog.provide('goog.events.PasteHandler.State');

goog.require('goog.Timer');
goog.require('goog.async.ConditionalDelay');
goog.require('goog.debug.Logger');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');



***REMOVED***
***REMOVED*** A paste event detector. Gets an {@code element} as parameter and fires
***REMOVED*** {@code goog.events.PasteHandler.EventType.PASTE} events when text is
***REMOVED*** pasted in the {@code element}. Uses heuristics to detect paste events in FF2.
***REMOVED*** See more details of the heuristic on {@link #handleEvent_}.
***REMOVED***
***REMOVED*** @param {Element} element The textarea element we are listening on.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.events.PasteHandler = function(element) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element that you want to listen for paste events on.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = element;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The last known value of the element. Kept to check if things changed. See
  ***REMOVED*** more details on {@link #handleEvent_}.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.oldValue_ = this.element_.value;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Handler for events.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The last time an event occurred on the element. Kept to check whether the
  ***REMOVED*** last event was generated by two input events or by multiple fast key events
  ***REMOVED*** that got swallowed. See more details on {@link #handleEvent_}.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lastTime_ = goog.now();

  if (goog.userAgent.WEBKIT ||
      goog.userAgent.IE ||
      goog.userAgent.GECKO && goog.userAgent.isVersion('1.9')) {
    // Most modern browsers support the paste event.
    this.eventHandler_.listen(element, goog.events.EventType.PASTE,
        this.dispatch_);
  } else {
    // But FF2 and Opera doesn't. we listen for a series of events to try to
    // find out if a paste occurred. We enumerate and cover all known ways to
    // paste text on textareas.  See more details on {@link #handleEvent_}.
    var events = [
      goog.events.EventType.KEYDOWN,
      goog.events.EventType.BLUR,
      goog.events.EventType.FOCUS,
      goog.events.EventType.MOUSEOVER,
      'input'
    ];
    this.eventHandler_.listen(element, events, this.handleEvent_);
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** ConditionalDelay used to poll for changes in the text element once users
  ***REMOVED*** paste text. Browsers fire paste events BEFORE the text is actually present
  ***REMOVED*** in the element.value property.
  ***REMOVED*** @type {goog.async.ConditionalDelay}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.delay_ = new goog.async.ConditionalDelay(
      goog.bind(this.checkUpdatedText_, this));

***REMOVED***
goog.inherits(goog.events.PasteHandler, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The types of events fired by this class.
***REMOVED*** @enum {string}
***REMOVED***
goog.events.PasteHandler.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched as soon as the paste event is detected, but before the pasted
  ***REMOVED*** text has been added to the text element we're listening to.
 ***REMOVED*****REMOVED***
  PASTE: 'paste',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched after detecting a change to the value of text element
  ***REMOVED*** (within 200msec of receiving the PASTE event).
 ***REMOVED*****REMOVED***
  AFTER_PASTE: 'after_paste'
***REMOVED***


***REMOVED***
***REMOVED*** The mandatory delay we expect between two {@code input} events, used to
***REMOVED*** differentiated between non key paste events and key events.
***REMOVED*** @type {number}
***REMOVED***
goog.events.PasteHandler.MANDATORY_MS_BETWEEN_INPUT_EVENTS_TIE_BREAKER =
    400;


***REMOVED***
***REMOVED*** The period between each time we check whether the pasted text appears in the
***REMOVED*** text element or not.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.PASTE_POLLING_PERIOD_MS_ = 50;


***REMOVED***
***REMOVED*** The maximum amount of time we want to poll for changes.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.PASTE_POLLING_TIMEOUT_MS_ = 200;


***REMOVED***
***REMOVED*** The states that this class can be found, on the paste detection algorithm.
***REMOVED*** @enum {string}
***REMOVED***
goog.events.PasteHandler.State = {
  INIT: 'init',
  FOCUSED: 'focused',
  TYPING: 'typing'
***REMOVED***


***REMOVED***
***REMOVED*** The initial state of the paste detection algorithm.
***REMOVED*** @type {goog.events.PasteHandler.State}
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.state_ =
    goog.events.PasteHandler.State.INIT;


***REMOVED***
***REMOVED*** The previous event that caused us to be on the current state.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.previousEvent_;


***REMOVED***
***REMOVED*** A logger, used to help us debug the algorithm.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.events.PasteHandler');


***REMOVED*** @override***REMOVED***
goog.events.PasteHandler.prototype.disposeInternal = function() {
  goog.events.PasteHandler.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  this.eventHandler_ = null;
  this.delay_.dispose();
  this.delay_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current state of the paste detection algorithm. Used mostly for
***REMOVED*** testing.
***REMOVED*** @return {goog.events.PasteHandler.State} The current state of the class.
***REMOVED***
goog.events.PasteHandler.prototype.getState = function() {
  return this.state_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the event handler.
***REMOVED*** @return {goog.events.EventHandler} The event handler.
***REMOVED*** @protected
***REMOVED***
goog.events.PasteHandler.prototype.getEventHandler = function() {
  return this.eventHandler_;
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the element.value property was updated, and if so, dispatches
***REMOVED*** the event that let clients know that the text is available.
***REMOVED*** @return {boolean} Whether the polling should stop or not, based on whether
***REMOVED***     we found a text change or not.
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.checkUpdatedText_ = function() {
  if (this.oldValue_ == this.element_.value) {
    return false;
  }
  this.logger_.info('detected textchange after paste');
  this.dispatchEvent(goog.events.PasteHandler.EventType.AFTER_PASTE);
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the paste event.
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.dispatch_ = function(e) {
  var event = new goog.events.BrowserEvent(e.getBrowserEvent());
  event.type = goog.events.PasteHandler.EventType.PASTE;
  this.dispatchEvent(event);

  // Starts polling for updates in the element.value property so we can tell
  // when do dispatch the AFTER_PASTE event. (We do an initial check after an
  // async delay of 0 msec since some browsers update the text right away and
  // our poller will always wait one period before checking).
  goog.Timer.callOnce(function() {
    if (!this.checkUpdatedText_()) {
      this.delay_.start(
          goog.events.PasteHandler.PASTE_POLLING_PERIOD_MS_,
          goog.events.PasteHandler.PASTE_POLLING_TIMEOUT_MS_);
    }
  }, 0, this);
***REMOVED***


***REMOVED***
***REMOVED*** The main event handler which implements a state machine.
***REMOVED***
***REMOVED*** To handle FF2, we enumerate and cover all the known ways a user can paste:
***REMOVED***
***REMOVED*** 1) ctrl+v, shift+insert, cmd+v
***REMOVED*** 2) right click -> paste
***REMOVED*** 3) edit menu -> paste
***REMOVED*** 4) drag and drop
***REMOVED*** 5) middle click
***REMOVED***
***REMOVED*** (1) is easy and can be detected by listening for key events and finding out
***REMOVED*** which keys are pressed. (2), (3), (4) and (5) do not generate a key event,
***REMOVED*** so we need to listen for more than that. (2-5) all generate 'input' events,
***REMOVED*** but so does key events. So we need to have some sort of 'how did the input
***REMOVED*** event was generated' history algorithm.
***REMOVED***
***REMOVED*** (2) is an interesting case in Opera on a Mac: since Macs does not have two
***REMOVED*** buttons, right clicking involves pressing the CTRL key. Even more interesting
***REMOVED*** is the fact that opera does NOT set the e.ctrlKey bit. Instead, it sets
***REMOVED*** e.keyCode = 0.
***REMOVED*** {@link http://www.quirksmode.org/js/keys.html}
***REMOVED***
***REMOVED*** (1) is also an interesting case in Opera on a Mac: Opera is the only browser
***REMOVED*** covered by this class that can detect the cmd key (FF2 can't apparently). And
***REMOVED*** it fires e.keyCode = 17, which is the CTRL key code.
***REMOVED*** {@link http://www.quirksmode.org/js/keys.html}
***REMOVED***
***REMOVED*** NOTE(user, pbarry): There is an interesting thing about (5): on Linux, (5)
***REMOVED*** pastes the last thing that you highlighted, not the last thing that you
***REMOVED*** ctrl+c'ed. This code will still generate a {@code PASTE} event though.
***REMOVED***
***REMOVED*** We enumerate all the possible steps a user can take to paste text and we
***REMOVED*** implemented the transition between the steps in a state machine. The
***REMOVED*** following is the design of the state machine:
***REMOVED***
***REMOVED*** matching paths:
***REMOVED***
***REMOVED*** (1) happens on INIT -> FOCUSED -> TYPING -> [e.ctrlKey & e.keyCode = 'v']
***REMOVED*** (2-3) happens on INIT -> FOCUSED -> [input event happened]
***REMOVED*** (4) happens on INIT -> [mouseover && text changed]
***REMOVED***
***REMOVED*** non matching paths:
***REMOVED***
***REMOVED*** user is typing normally
***REMOVED*** INIT -> FOCUS -> TYPING -> INPUT -> INIT
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.handleEvent_ = function(e) {
  // transition between states happen at each browser event, and depend on the
  // current state, the event that led to this state, and the event input.
  switch (this.state_) {
    case goog.events.PasteHandler.State.INIT: {
      this.handleUnderInit_(e);
      break;
    }
    case goog.events.PasteHandler.State.FOCUSED: {
      this.handleUnderFocused_(e);
      break;
    }
    case goog.events.PasteHandler.State.TYPING: {
      this.handleUnderTyping_(e);
      break;
    }
    default: {
      this.logger_.severe('invalid ' + this.state_ + ' state');
    }
  }
  this.lastTime_ = goog.now();
  this.oldValue_ = this.element_.value;
  this.logger_.info(e.type + ' -> ' + this.state_);
  this.previousEvent_ = e.type;
***REMOVED***


***REMOVED***
***REMOVED*** {@code goog.events.PasteHandler.EventType.INIT} is the first initial state
***REMOVED*** the textarea is found. You can only leave this state by setting focus on the
***REMOVED*** textarea, which is how users will input text. You can also paste things using
***REMOVED*** drag and drop, which will not generate a {@code goog.events.EventType.FOCUS}
***REMOVED*** event, but will generate a {@code goog.events.EventType.MOUSEOVER}.
***REMOVED***
***REMOVED*** For browsers that support the 'paste' event, we match it and stay on the same
***REMOVED*** state.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.handleUnderInit_ = function(e) {
  switch (e.type) {
    case goog.events.EventType.BLUR: {
      this.state_ = goog.events.PasteHandler.State.INIT;
      break;
    }
    case goog.events.EventType.FOCUS: {
      this.state_ = goog.events.PasteHandler.State.FOCUSED;
      break;
    }
    case goog.events.EventType.MOUSEOVER: {
      this.state_ = goog.events.PasteHandler.State.INIT;
      if (this.element_.value != this.oldValue_) {
        this.logger_.info('paste by dragdrop while on init!');
        this.dispatch_(e);
      }
      break;
    }
    default: {
      this.logger_.severe('unexpected event ' + e.type + 'during init');
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** {@code goog.events.PasteHandler.EventType.FOCUSED} is typically the second
***REMOVED*** state the textarea will be, which is followed by the {@code INIT} state. On
***REMOVED*** this state, users can paste in three different ways: edit -> paste,
***REMOVED*** right click -> paste and drag and drop.
***REMOVED***
***REMOVED*** The latter will generate a {@code goog.events.EventType.MOUSEOVER} event,
***REMOVED*** which we match by making sure the textarea text changed. The first two will
***REMOVED*** generate an 'input', which we match by making sure it was NOT generated by a
***REMOVED*** key event (which also generates an 'input' event).
***REMOVED***
***REMOVED*** Unfortunately, in Firefox, if you type fast, some KEYDOWN events are
***REMOVED*** swallowed but an INPUT event may still happen. That means we need to
***REMOVED*** differentiate between two consecutive INPUT events being generated either by
***REMOVED*** swallowed key events OR by a valid edit -> paste -> edit -> paste action. We
***REMOVED*** do this by checking a minimum time between the two events. This heuristic
***REMOVED*** seems to work well, but it is obviously a heuristic :).
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.handleUnderFocused_ = function(e) {
  switch (e.type) {
    case 'input' : {
      // there are two different events that happen in practice that involves
      // consecutive 'input' events. we use a heuristic to differentiate
      // between the one that generates a valid paste action and the one that
      // doesn't.
      // @see testTypingReallyFastDispatchesTwoInputEventsBeforeTheKEYDOWNEvent
      // and
      // @see testRightClickRightClickAlsoDispatchesTwoConsecutiveInputEvents
      // Notice that an 'input' event may be also triggered by a 'middle click'
      // paste event, which is described in
      // @see testMiddleClickWithoutFocusTriggersPasteEvent
      var minimumMilisecondsBetweenInputEvents = this.lastTime_ +
          goog.events.PasteHandler.
              MANDATORY_MS_BETWEEN_INPUT_EVENTS_TIE_BREAKER;
      if (goog.now() > minimumMilisecondsBetweenInputEvents ||
          this.previousEvent_ == goog.events.EventType.FOCUS) {
        this.logger_.info('paste by textchange while focused!');
        this.dispatch_(e);
      }
      break;
    }
    case goog.events.EventType.BLUR: {
      this.state_ = goog.events.PasteHandler.State.INIT;
      break;
    }
    case goog.events.EventType.KEYDOWN: {
      this.logger_.info('key down ... looking for ctrl+v');
      // Opera + MAC does not set e.ctrlKey. Instead, it gives me e.keyCode = 0.
      // http://www.quirksmode.org/js/keys.html
      if (goog.userAgent.MAC && goog.userAgent.OPERA && e.keyCode == 0 ||
          goog.userAgent.MAC && goog.userAgent.OPERA && e.keyCode == 17) {
        break;
      }
      this.state_ = goog.events.PasteHandler.State.TYPING;
      break;
    }
    case goog.events.EventType.MOUSEOVER: {
      if (this.element_.value != this.oldValue_) {
        this.logger_.info('paste by dragdrop while focused!');
        this.dispatch_(e);
      }
      break;
    }
    default: {
      this.logger_.severe('unexpected event ' + e.type + ' during focused');
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** {@code goog.events.PasteHandler.EventType.TYPING} is the third state
***REMOVED*** this class can be. It exists because each KEYPRESS event will ALSO generate
***REMOVED*** an INPUT event (because the textarea value changes), and we need to
***REMOVED*** differentiate between an INPUT event generated by a key event and an INPUT
***REMOVED*** event generated by edit -> paste actions.
***REMOVED***
***REMOVED*** This is the state that we match the ctrl+v pattern.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED*** @private
***REMOVED***
goog.events.PasteHandler.prototype.handleUnderTyping_ = function(e) {
  switch (e.type) {
    case 'input' : {
      this.state_ = goog.events.PasteHandler.State.FOCUSED;
      break;
    }
    case goog.events.EventType.BLUR: {
      this.state_ = goog.events.PasteHandler.State.INIT;
      break;
    }
    case goog.events.EventType.KEYDOWN: {
      if (e.ctrlKey && e.keyCode == goog.events.KeyCodes.V ||
          e.shiftKey && e.keyCode == goog.events.KeyCodes.INSERT ||
          e.metaKey && e.keyCode == goog.events.KeyCodes.V) {
        this.logger_.info('paste by ctrl+v while keypressed!');
        this.dispatch_(e);
      }
      break;
    }
    case goog.events.EventType.MOUSEOVER: {
      if (this.element_.value != this.oldValue_) {
        this.logger_.info('paste by dragdrop while keypressed!');
        this.dispatch_(e);
      }
      break;
    }
    default: {
      this.logger_.severe('unexpected event ' + e.type + ' during keypressed');
    }
  }
***REMOVED***