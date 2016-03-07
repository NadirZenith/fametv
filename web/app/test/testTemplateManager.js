'use strict';
var jsdom = require('mocha-jsdom');
var sinon = require('sinon');
var expect = require('chai').expect;
var rewire = require('rewire');
var storageMock = require('./fixtures/storageMock');

describe('Template Manager', function () {
    var $;
    var _;
    var Backbone;
    var settings;
    var templateManager;

    jsdom({
        console: false
    });

    before(function () {
        global.conf = require('./fixtures/conf');

        $ = require('jquery');
        _ = require('underscore');
        Backbone = require('backbone');
        templateManager = rewire("../src/js/app/template_manager");
        var settingsMock = {
            enableTemplatesCache: true
        };

        templateManager.__set__('settings', settingsMock);
        window.localStorage = storageMock;


    });


    beforeEach(function () {
        this.callback = sinon.spy();

        // Stubbing the ajax method
        sinon.stub($, 'ajax', function (options) {
            // Creating a deffered object 
            var dfd = $.Deferred();

            // assigns success callback to done.
            if (options.success)
                dfd.done(options.success('<h1>Hello <%=name%></h1>'));
            /*dfd.done(options.success({status_code: 200, data: {url: "bit.ly/aaaa"}}));*/

            // assigns error callback to fail.
            if (options.error)
                dfd.fail(options.error);
            dfd.success = dfd.done;
            dfd.error = dfd.fail;

            // returning the deferred object so that we can chain it.
            return dfd;
        });
    });

    afterEach(function () {
        $.ajax.restore();
    });

    it('should return false if it does no exist', function () {
        var tpl = templateManager.tryToLoadFromStorage('template_name');

        expect(tpl).eql(false);
    });

    it('should populate private properties', function (done) {
        expect(templateManager._templates).to.be.empty;

        templateManager.loadFromServer('template_name', this.callback);
        expect(this.callback.called).eql(true);


        expect(templateManager._templates).to.have.property('template_name');
        expect(templateManager._templates).to.have.property('template_name').that.is.a('function');
        expect(templateManager._cache.template_name).to.eql('<h1>Hello <%=name%></h1>');
        done();

    });

    it('should return rendered template from cache', function (done) {


        var res = templateManager.fetch('template_name', {name: 'foo'}, this.callback);
        expect(res).to.eql('<h1>Hello foo</h1>');
        expect(this.callback.calledOnce).eql(true);

        done();
    });
    it('should return rendered template from server', function (done) {

        var res0 = templateManager.fetch('template_name_2', {name: 'bar'}, function (res) {

            expect(res).to.eql('<h1>Hello bar</h1>');
        });
        expect(res0).eql(false);
        expect(this.callback.calledOnce).eql(false);

        done();
    });



    /*
     * 
     describe('Examples', function () {
     //examples
     it('has document', function () {
     var div = document.createElement('div')
     expect(div.nodeName).eql('DIV')
     });
     it('jquery works', function () {
     document.body.innerHTML = '<div>hola</div>';
     expect($("div").html()).eql('hola');
     });
     });
     **/




});