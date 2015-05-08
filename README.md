Backbone.D3View
===================


A drop-in replacement for Backbone.View that uses only D3 DOM methods for
element selection and event delegation. It has no dependency on jQuery.

NOTE: Backbone.D3View relies on edge (master branch) version of Backbone.
Backbone 1.1.2 is not compatible with Backbone.D3View.
We will hopefully release a new compatible version soon, but in the meantime 
please use the master branch or point your package manager to use a recent
git SHA.

To Use:
-------
Load Backbone.D3View with your favorite module loader or add as a script
tag after you have loaded Backbone and D3 in the page. Wherever you had previously
inherited from Backbone.View, you will now inherit from Backbone.D3View.

```js
var MyView = Backbone.D3View.extend({
  initialize: function(options) {
    // ...
  }
});
```

As an alternative, you may extend an existing View's prototype to use D3
methods, or even replace Backbone.View itself:

```js
_.extend(Backbone.View.prototype, Backbone.D3ViewMixin);

var MyView = Backbone.View.extend({
  initialize: function(options) {
    // ...
  }
});
```

Features:
---------
Delegation:
```js
var view = new MyView({el: '#my-element'});
view.delegate('click', view.clickHandler);
```

Undelegation with event names or listeners,
```js
view.undelegate('click', view.clickHandler);
view.undelegate('click');
```

View-scoped element finding that returns a NodeList:
```js
view.$('.box')[0].classList.remove('active'); // for one matched element
// for multiple matched elements
_.each(view.$('.sidebar'), function(el) {
  el.classList.add('active')
});
var fields = _.invoke(view.$('.field'), 'innerHTML');
```

View-scoped element finding that returns a d3 selector:
```js
var Graph = Backbone.D3View.extend({
  tagName: 'svg',

  render: function() {
    var node = this.$$(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }
});
```

Direct reference to the D3 selection:
```js
var Graph = Backbone.D3View.extend({
  el: '#graph',

  initialize: function() {
    this.d3el.classed({'foo': true, 'bar': false});
  }
});
```

Requirements:
-------------
* A browser that [supports D3](https://github.com/mbostock/d3/wiki#browser-support).

Running tests:
--------------
The test suite includes the original Backbone.View QUnit conformance tests as
well as a suite of Backbone.D3View-specific tests in mocha.

Notes:
------
* The `$el` property no longer exists on Views. Use `el` instead. You may also
  use the `d3el` property for the reference to the D3 selection.
* The `$` method returns a NodeList instead of a jQuery context. You can
  iterate over either using `_.each`.
