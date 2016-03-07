'use strict';
var jsdom = require('mocha-jsdom');
var sinon = require('sinon');
var expect = require('chai').expect;
var rewire = require('rewire');

describe('View Stack', function () {
    var $;
    var Backbone;
    var viewStack;

    jsdom({
        console: false
    });

    before(function () {

        global.conf = require('./fixtures/conf');
        $ = require('jquery');
        Backbone = require('backbone');

        viewStack = rewire("../src/js/app/view_stack");
        /*sinon.mock(window.console).expects("log").once().returns(null);*/

    });


    beforeEach(function () {
        var sampleView = new Backbone.View();
        sampleView.name = 'view_name';
        viewStack.addView('view_name', {}, sampleView, false);

        var sampleView = new Backbone.View();
        sampleView.name = 'view_name_hash';
        viewStack.addView('view_name_hash', {title: 'view title'}, sampleView, true);
    });

    /**
     * View Stack with hash (default) 
     */
    describe('Hash: true', function () {


        it("returns false if no view name stored", function () {
            var view = viewStack.getView('no_view_name');
            expect(view).to.equal(false);
        });

        it("returns view if view exists", function () {
            var view = viewStack.getView('view_name_hash', {title: 'view title'});
            expect(view.name).to.equal('view_name_hash');

        });
        it("Build hash function", function () {
            var buildHash = viewStack.__get__('buildHash');

            var hash = buildHash('view_name', {key: 'value1 value2'});
            expect(hash).to.equal('view_name-key_value1 value2');

        });
    });

    /**
     * View Stack without hash 
     */
    describe('Hash: false', function () {

        it("returns false if no view name stored", function () {
            var view = viewStack.getView('no_view_name', {}, false);
            expect(view).to.equal(false);
        });

        it("returns view if view exists", function () {
            var view = viewStack.getView('view_name', {}, false);
            expect(view.name).to.equal('view_name');

        });
    });


});