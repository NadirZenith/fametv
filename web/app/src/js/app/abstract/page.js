'use strict';
var $ = window.$ = window.jQuery = require('jquery');
// var App = require('./../../app');
var templateManager = require('./../template_manager');
var settings = require('./../settings');
var log = require('./../log');
var viewStack = require('./../view_stack');
var Backbone = require('backbone');

// page.js
var AbstractPage = Backbone.View.extend({
    isReady: false,
    requiresSignedIn: false,
    widgets: [],
    parts: [],
    partsInitialized: false,
    setURL: function (url) {
        if (typeof (url) === 'undefined') {
            url = '';
            if (typeof (this.url) === 'function')
                url = this.url();
            else if (typeof (this.url) === 'string')
                url = this.url;
        }

        if (url) {
            App.router.setUrl(url);
            log.setURL(url);
        } else {
            log.setURL('');
        }

        log.pageView();
    },
    setTitle: function (title) {
        if (typeof (title) === 'undefined') {
            title = '';
            if (typeof (this.title) === 'function')
                title = this.title();
            else if (typeof (this.title) === 'string')
                title = this.title;
        }

        if (typeof (settings.title) == 'function')
            title = settings.title(title);

        if (title) {
            console.log("Document title changed to '" + title + "'");
            $(document).attr('title', title);
            log.setTitle(title);
        }
    },
    wakeUp: function () {
        var App = require('./../../app');

        App.setProgress(false);
        this.holderReady = false;
        this.render();
    },
    sleep: function () {
        for (var k in this.parts) {
            this.parts[k].undelegateEvents();
            this.parts[k].stopListening();
            console.log('sleep: ' + k, this);
        }

        this.undelegateEvents();
        this.stopListening();
    },
    proccessWidgets: function () {
        this.widgets = [];
        var that = this;
        this.$('.client-side-widget').each(function () {
            var data = $(this).data();
            if (typeof (data.widgetName) === 'undefined' || !data.widgetName)
                return false;

            if (typeof (App.Views.Widgets[data.widgetName]) === 'undefined') {
                console.error('Widget class for ' + data.widgetName + ' is not defined');
                return false;
            }

            var widgetView = new App.Views.Widgets[data.widgetName]({
                el: $(this)
            });

            that.widgets.push(widgetView);
        });
    },
    renderHTML: function (data) {

        if (typeof (this.templateName) === 'undefined' || !this.templateName)
            throw 'templateName is undefined';

        if (typeof (data) === 'undefined')
            data = {};

        this.switchBuffers();

        var App = require('./../../app');
        var that = this;
        templateManager.fetch(this.templateName, data, function (html) {
            that.$el.html('<div class="page">' + html + '</div>');
            $('.page', "#page_holder_" + App.currentHolder).removeClass('page_loading');
            /*that.$el.html(html);*/
            that.proccessWidgets();
            that.trigger('render');
            that.trigger('loaded');

            App.setProgress(true);
        });
        this.setTitle();
        this.setURL();
        this.isReady = true;

        return this;
    },
    switchBuffers: function () {
        if (typeof (this.holderReady) !== 'undefined' && this.holderReady === true)
            return true;

        var App = require('./../../app');

        console.log('Switching buffers');
        var holderToRenderTo = 2;
        if (typeof (App.currentHolder) !== 'undefined' && App.currentHolder == 2)
            holderToRenderTo = 1;

        var holderToFadeOut = (holderToRenderTo === 1) ? 2 : 1;

        $("#page_holder_" + holderToFadeOut).hide();
        $("#page_holder_" + holderToFadeOut).html('');
        $("#page_holder_" + holderToRenderTo).show();

        this.setElement($("#page_holder_" + holderToRenderTo));

        App.currentHolder = holderToRenderTo;

        this.holderReady = true;
    },
    renderLoading: function () {
        var App = require('./../../app');
        /// ask templateManager to prepare template
        App.setProgress(false);
        templateManager.fetch(this.templateName, {});

        this.switchBuffers();

        this.$el.html('<div class="page page_loading"></div>');

        this.setTitle();
        this.setURL();

        console.log('Displaying loading');
        this.trigger('loading');
    }

});

module.exports = AbstractPage;