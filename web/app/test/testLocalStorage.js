'use strict';
var jsdom = require('mocha-jsdom');
var sinon = require('sinon');
var expect = require('chai').expect;
var rewire = require('rewire');
var storageMock = require('./fixtures/storageMock');

describe('Local Storage', function () {
    var localStorage;



    jsdom({
        console: false
    });

    before(function () {
        // mock the localStorage
        window.localStorage = storageMock;

        localStorage = rewire("../src/js/app/local_storage");
        localStorage.set('test', {foo: 'bar'});
        localStorage.set('test2', {bar: 'foo'});

    });


    beforeEach(function () {
    });

    it('should save data', function () {
        var d = localStorage.get('test');
        expect(d).to.have.property('foo');

    });
    it('should remove data', function () {
        expect(localStorage.remove('test2')).to.equal(true);
        expect(localStorage.get('test2')).to.equal(undefined);
    });
    it('should invalidate', function () {
        localStorage.invalidate(1);
        expect(localStorage.get('test')).to.equal(undefined);
    });

});