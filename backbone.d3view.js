// Backbone.D3View.js 0.3.1
// ---------------

//     (c) 2015 Adam Krebs
//     Backbone.D3View may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/akre54/Backbone.D3View

(function (factory) {
  if (typeof define === 'function' && define.amd) { define(['backbone', 'd3'], factory);
  } else if (typeof exports === 'object') { module.exports = factory(require('backbone'), require('d3'));
  } else { factory(Backbone, d3); }
}(function (Backbone, d3) {

  // Cached regex to match an opening '<' of an HTML tag, possibly left-padded
  // with whitespace.
  var paddedLt = /^\s*</;

  var ElementProto = (typeof Element !== 'undefined' && Element.prototype) || {};
  var matchesSelector = ElementProto.matches ||
    ElementProto.webkitMatchesSelector ||
    ElementProto.mozMatchesSelector ||
    ElementProto.msMatchesSelector ||
    ElementProto.oMatchesSelector;

  Backbone.D3ViewMixin = {

    // A reference to the d3 selection backing the view.
    d3el: null,

    namespace: d3.ns.prefix.svg,

    $: function(selector) {
      return this.el.querySelectorAll(selector);
    },

    $$: function(selector) {
      return this.d3el.selectAll(selector);
    },

    _removeElement: function() {
      this.undelegateEvents();
      this.d3el.remove();
    },

    _createElement: function(tagName) {
      var ns = typeof this.namespace === 'function' ? this.namespace() : this.namespace;
      return ns ?
         document.createElementNS(ns, tagName) :
         document.createElement(tagName);
    },

    _setElement: function(element) {
      if (typeof element == 'string') {
        if (paddedLt.test(element)) {
          var el = document.createElement('div');
          el.innerHTML = element;
          this.el = el.firstChild;
        } else {
          this.el = document.querySelector(element);
        }
      } else {
        this.el = element;
      }

      this.d3el = d3.select(this.el);
    },

    _setAttributes: function(attributes) {
      this.d3el.attr(attributes);
    },

    // `delegate` supports two- and three-arg forms. The `selector` is optional.
    delegate: function(eventName, selector, listener) {
      if (listener === undefined) {
        listener = selector;
        selector = null;
      }

      var view = this;
      var wrapped = function(event) {
        var node = event.target,
            idx = 0,
            o = d3.event;

        d3.event = event;

        // The `event` object is stored in `d3.event` but Backbone expects it as
        // the first argument to the listener.
        if (!selector) {
          listener.call(view, d3.event, node.__data__, idx++);
          d3.event = o;
          return;
        }

        while (node && node !== view.el) {
          if (matchesSelector.call(node, selector)) {
            listener.call(view, d3.event, node.__data__, idx++);
          }
          node = node.parentNode;
        }
        d3.event = o;
      };

      var map = this._domEvents || (this._domEvents = {});
      var handlers = map[eventName] || (map[eventName] = []);
      handlers.push({selector: selector, listener: listener, wrapped: wrapped});

      this.el.addEventListener(eventName, wrapped, false);
      return this;
    },

    undelegate: function(eventName, selector, listener) {
      if (!this._domEvents || !this._domEvents[eventName]) return;

      if (typeof selector !== 'string') {
        listener = selector;
        selector = null;
      }

      var handlers = this._domEvents[eventName].slice();
      var i = handlers.length;
      while (i--) {
        var handler = handlers[i];

        var match = (listener ? handler.listener === listener : true) &&
            (selector ? handler.selector === selector : true);

        if (!match) continue;

        this.el.removeEventListener(eventName, handler.wrapped, false);
        this._domEvents[eventName].splice(i, 1);
      }
    },

    undelegateEvents: function() {
      var map = this._domEvents, el = this.el;
      if (!el || !map) return;

      Object.keys(map).forEach(function(eventName) {
        map[eventName].forEach(function(handler) {
          el.removeEventListener(eventName, handler.wrapped, false);
        });
      });

      this._domEvents = {};
      return this;
    }
  };

  Backbone.D3View = Backbone.View.extend(Backbone.D3ViewMixin);

  return Backbone.D3View;
}));
