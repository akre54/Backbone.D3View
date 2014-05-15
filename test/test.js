var expect = require("chai").expect,
    _ = require('underscore'),
    Backbone = require('backbone'),
    D3View = require('../backbone.d3view');

describe('Backbone.D3View', function() {
  it('exports as Backbone.D3View', function() {
    expect(D3View).to.equal(Backbone.D3View);
  });

  it('can be mixed into another View', function() {
    var View = Backbone.View.extend(Backbone.D3ViewMixin);
    var view = new View;
    // expect(view).not.to.be.an.instanceOf(Backbone.D3View);
    expect(view.el.tagName.toLowerCase()).to.equal('div');
  });

  describe('namespaces', function() {
    it('creates an element with a namespace if one is set (default)', function() {
      var view = new D3View({tagName: 'svg'});
      expect(view.el.namespaceURI).to.equal('http://www.w3.org/2000/svg');
    });

    it('creates an element with no namespace if one is not set', function() {
      var NoNSView = D3View.extend({namespace: null});
      var view = new NoNSView;
      expect(view.el.namespaceURI).to.be.null;
    });
  });

});