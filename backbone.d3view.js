// Backbone.D3View.js 0.1.0
// ---------------

//     (c) 2014 Adam Krebs
//     Backbone.D3View may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/akre54/Backbone.D3View

(function (factory) {
  if (typeof define === 'function' && define.amd) { define(['backbone', 'd3'], factory);
  } else if (typeof exports === 'object') { factory(require('backbone'), require('d3'));
  } else { factory(Backbone, d3); }
}(function (Backbone, d3) {

  // Cached regex to match an opening '<' of an HTML tag, possibly left-padded
  // with whitespace.
  var paddedLt = /^\s*</;

  // Cache array methods for later use.
  var slice = [].slice;

  // Events need a unique id for attaching multiple events of the same type.
  var uniqueId = 0;

  // Cache Backbone.View for use in `constructor`.
  var BBView = Backbone.View;

  Backbone.D3ViewMixin = {

    // Store
    _eventsMap: null,

    constructor: function() {
      this._eventsMap = {};
      BBView.apply(this, arguments);
    },

    $: function(selector) {
      return this.d3el.selectAll(selector)[0];
    },

    _removeElement: function() {
      this.undelegateEvents();
      this.d3el.remove();
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
      var el;

      if (typeof selector === 'string') {
        el = selector === '' ? this.d3el : this.d3el.selectAll(selector);
      } else {
        el = this.d3el;
        listener = selector;
        selector = null;
      }

      // d3 needs `uniqueId` to delegate more than one listener per event type.
      var namespace = '.' + uniqueId++;

      (this._eventsMap[eventName] || (this._eventsMap[eventName] = [])).push({
        selector: selector,
        listener: listener,
        namespace: namespace
      });

      // The `event` object is stored in `d3.event` but Backbone expects it as
      // the first argument to the listener.
      el.on(eventName + namespace, function() {
        var args = slice.call(arguments);
        args.unshift(d3.event)
        listener.apply(this, args);
      });
      return this;
    },

    undelegate: function(eventName, selector, listener) {
      if (typeof selector !== 'string') {
        listener = selector;
        selector = null;
      }

      var handlers = this._eventsMap[eventName];

      _(handlers).chain()
        .filter(function(item) {
          return (listener ? item.listener === listener : true) &&
            (selector ? item.selector === selector : true);
        })
        .forEach(function(item) {
          var el = (selector || (!selector && item.selector)) ? this.d3el.selectAll(selector || item.selector) : this.d3el;
          el.on(eventName + item.namespace, null);
          handlers.splice(_.indexOf(handlers, item), 1);
        }, this);
    },

    undelegateEvents: function() {
      if (!this.d3el) return;

      _.each(this._eventsMap, function(handlers, eventName) {
        _.each(handlers, function(item) {
          this.undelegate(eventName, item.selector)
        }, this);
      }, this);
      this._eventsMap = {};
      return this;
    }
  };

  Backbone.D3View = Backbone.View.extend(Backbone.D3ViewMixin);

  return Backbone.D3View;
}));
