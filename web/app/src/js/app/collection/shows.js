'use strict';
var settings = require('./../settings');
var Show = require('./../model/show');
var PageableCollection = require("backbone.paginator");
var _ = require("underscore");
// shows.js
var Shows = PageableCollection.extend({
    model: Show,
    /*var Shows = Backbone.Collection.extend({*/
    mode: "infinite",
    /*mode: "server",*/
    // Initial pagination states
    state: {
        pageSize: 12,
        /*sortKey: "publication_date_start",*/
        order: 1,
        /*collection: null*/
    },
    // You can remap the query parameters from ``state`` keys from the default
    // to those your server supports. Setting ``null`` on queryParams removed them
    // from being appended to the request URLs.
    queryParams: {
        pageSize: "count",
        totalPages: null,
        totalRecords: null,
        /*sortKey: "sort",*/
        order: "direction",
        directions: {
            "-1": "asc",
            "1": "desc"
        },
        collection: null,
    },
    comparator: function (model) {
        return -model.get('publication_date_start');
    },
    parseLinks: function (resp, options) {

        var next = (resp.last_page === resp.page) ? null : resp.page + 1;
        var prev = (resp.page === resp.page) ? null : api + resp.page - 1;

        var api = settings.apiEntryPoint + 'shows/posts.json?page=';
        var firstPage = api + 1;
        var nextPage = next ? api + next : null;
        var prevPage = prev ? api + prev : null;

        return {
            first: firstPage,
            next: nextPage,
            prev: prevPage
        };

    },
    current: null,
    initialize: function () {
        /*this.bindAll(this);*/
        /*this.bind('reset', this.onReset, this);*/
        /*this.bind('sync', this.onSync, this);*/
    },
    onReset: function () {
        this.setCurrent(this.at(0));
    },
    onSync: function () {
        var $d = $('#debug-list');
        var html = '';
        var self = this;
        this.fullCollection.each(function (model) {
            if (self.current.get('id') === model.get('id')) {
                html += '->';
            }

            html += model.get('id') + '<br>';
        });
        $d.html(html);
    },
    url: function () {
        //api
        return settings.apiEntryPoint + 'shows/posts.json';
        //dev
        return settings.apiEntryPoint + 'shows.php';
    },
    parse: function (r) {
        return r.entries;
        //dev
        return r;
    },
    getCurrent: function () {
        return this.current;
    },
    setCurrent: function (model) {
        /*var $d = $('#debug-current');*/
        /*$d.html(model.get('id'));*/
        this.current = model;
        return this.current;
    },
    search: function (opts) {
        // var result = this.where(opts);
        // var resultCollection = new App.Collections.Wallets(result);

        // return resultCollection;
    },
    getFirst: function () {
        var first = this.fullCollection.at(0);
        return first;
    },
    getNext: function (current) {
        return this.fullCollection.at(_.indexOf(this.fullCollection.models, current) + 1);

    },
    getById: function (id) {
        var model = this.fullCollection.get(id);

        if (model.attributes.attributes) {
            model = model.attributes;
        }

        return model;

    }
});
module.exports = Shows;