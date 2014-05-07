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

  describe('createElement with namespaces', function() {
    it('creates with a namespace if passed an svg', function() {
      var view = new D3View({tagName: 'svg'});
      expect(view.el.namespaceURI).to.equal('http://www.w3.org/2000/svg');
    });

    it('creates with no namespace if not passed svg', function() {
      var view = new D3View;
      expect(view.el.namespaceURI).to.be.undefined;
    });
  });

});