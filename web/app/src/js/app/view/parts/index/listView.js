'use strict';
var $ = window.$ = window.jQuery = require('jquery');
var App = require('./../../../../app');
var templateManager = require('./../../../template_manager');

var Backbone = require('backbone');

// listView.js
var listView = Backbone.View.extend({
    templateName: 'parts/showsList',
    templateItems: 'parts/showsListItems',
    initialize: function (options) {
        this.setLoading(true);

        this.listenTo(this.collection, 'reset', this.onReset);
    },
    setLoading: function (bool) {
        if (bool) {
            this.$el.addClass('part_loading');
            this.$el.html('');
        } else {
            this.$el.removeClass('part_loading');

        }
    },
    onReset: function (evt, options) {
        var self = this;
        if (options.reset) {
            self.render();
        } else {
            self.renderFetched();
        }
    },
    loadNextPage: function (success, error) {
        if (this.loading_more) {
            return;
        }
        this.loading_more = true;

        var self = this;
        try {
            this.collection.getNextPage({
                reset: false, fetch: true
            }).done(function () {
                if (typeof (success) === 'function') {
                    success();
                }
                self.loading_more = false;

            });
        } catch (e) {
            if (typeof (error) === 'function') {
                error();
            }
            self.loading_more = false;

        }
    },
    render: function () {
        var data = {
            collection: this.collection
        }

        var self = this;
        templateManager.fetch(this.templateName, data, function (html) {
            self.$el.html(html);

            self.setLoading(false);

        });

    },
    renderFetched: function () {

        var data = {
            collection: this.collection
        }

        var self = this;
        templateManager.fetch(this.templateItems, data, function (html) {
            self.$el.append(html);
        });

    },
});

module.exports = listView;
