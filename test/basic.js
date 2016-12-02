var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;

describe('htmlcomponent', function() {
	var htmlcomponent;
	var dom;
	jsdom();

	//global.window = {};

	before(function() {
		htmlcomponent = require('../dist/htmlcomponent.min.js');


	});

	it("should basically work", function(done) {
		var dom  = document.createElement("div");
		dom.innerHTML="<div data-hc='myapp' />";
		htmlcomponent.setStaticLoader({
			'myapp': function(dom, opts) {
				expect(dom).to.be.not.null;
				done();
			}
		});
		htmlcomponent.query(dom);
	});

	it("should support options", function(done) {
		var dom  = document.createElement("div");
		dom.innerHTML="<div data-hc='myapp' data-hcd='{\"setting\":true}' />";
		htmlcomponent.setStaticLoader({
			'myapp': function(dom, opts) {
				expect(dom).to.be.not.null;
				expect(opts.setting).to.be.true;
				done();
			}
		});
		htmlcomponent.query(dom);
	});

	it("should support inner options", function(done) {
		var dom  = document.createElement("div");
		dom.innerHTML="<div data-hc='myapp'><script type='appliction/json' data-hcd>{\"setting\":true}</script></div>";
		htmlcomponent.setStaticLoader({
			'myapp': function(dom, opts) {
				expect(dom).to.be.not.null;
				expect(opts.setting).to.be.true;
				done();
			}
		});
		htmlcomponent.query(dom);
	});

});
