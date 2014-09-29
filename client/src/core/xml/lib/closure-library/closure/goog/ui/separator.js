// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A class for representing a separator, with renderers for both
***REMOVED*** horizontal (menu) and vertical (toolbar) separators.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.Separator');

goog.require('goog.a11y.aria');
goog.require('goog.asserts');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('goog.ui.MenuSeparatorRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Class representing a separator.  Although it extends {@link goog.ui.Control},
***REMOVED*** the Separator class doesn't allocate any event handlers, nor does it change
***REMOVED*** its appearance on mouseover, etc.
***REMOVED*** @param {goog.ui.MenuSeparatorRenderer=} opt_renderer Renderer to render or
***REMOVED***    decorate the separator; defaults to {@link goog.ui.MenuSeparatorRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***    document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED***
goog.ui.Separator = function(opt_renderer, opt_domHelper) {
  goog.ui.Control.call(this, null, opt_renderer ||
      goog.ui.MenuSeparatorRenderer.getInstance(), opt_domHelper);

  this.setSupportedState(goog.ui.Component.State.DISABLED, false);
  this.setSupportedState(goog.ui.Component.State.HOVER, false);
  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);

  // Separators are always considered disabled.
  this.setStateInternal(goog.ui.Component.State.DISABLED);
***REMOVED***
goog.inherits(goog.ui.Separator, goog.ui.Control);


***REMOVED***
***REMOVED*** Configures the component after its DOM has been rendered.  Overrides
***REMOVED*** {@link goog.ui.Control#enterDocument} by making sure no event handler
***REMOVED*** is allocated.
***REMOVED*** @override
***REMOVED***
goog.ui.Separator.prototype.enterDocument = function() {
  goog.ui.Separator.superClass_.enterDocument.call(this);
  var element = this.getElement();
  goog.asserts.assert(element,
      'The DOM element for the separator cannot be null.');
  goog.a11y.aria.setRole(element, 'separator');
***REMOVED***


// Register a decorator factory function for goog.ui.MenuSeparators.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.MenuSeparatorRenderer.CSS_CLASS,
    function() {
      // Separator defaults to using MenuSeparatorRenderer.
      return new goog.ui.Separator();
    });