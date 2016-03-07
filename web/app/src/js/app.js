'use strict';
var $ = window.$ = window.jQuery = require('jquery');
var settings = require('./app/settings');
var viewStack = require('./app/view_stack');
var Mprogress = require('../../node_modules/mprogress/mprogress.min');

module.exports = {
    Models: {},
    Collections: {},
    Views: {
        // Abstract: {},
        Dialogs: {
            Contact: require('./app/view/dialog/contact')
        },
        Pages: {
            Index: require('./app/view/pages/index'),
            Page: require('./app/view/pages/page')
        },
        // Widgets: {},
        Parts: {
            Header: require('./app/view/header')
        },
        // Charts: {}
    },
    dialog: null,
    page: null,
    header: null,
    // footer: null,
    // settings: null,
    // currentUser: null,
    init: function () {
        var that = this;
        $.ajaxSetup({
            cache: false
        });

        var doneCallback = function () {
            var router = require('./app/router');

            router.init();
            that.loadingStatus(false);
        };
        doneCallback();

    },
    showDialog: function (dialogName, params) {
        var app = this;

        if (typeof (app.Views.Dialogs[dialogName]) === 'undefined') /// this page is already current
            return false;

        if (app.dialog && app.dialog.isVisible) {
            app.dialog.once('hidden', function () {
                console.log('Ready to show another dialog');
                app.dialog = new app.Views.Dialogs[dialogName](params);
            }, this);
            app.dialog.hide();
        } else {
            app.dialog = new app.Views.Dialogs[dialogName](params);
            /*app.log.event('dialog', 'Show Dialog ' + dialogName);*/
        }

        return true;
    },
    showPage: function (pageName, params) {
        if (typeof (this.Views.Pages[pageName]) === 'undefined') {
            console.error("There is no view class defined");
            return false;
        }

        this.renderLayoutBlocks();

        console.group('%c- Showing page: %s -', 'background: #222; color: #bada55', pageName);
        // if (App.currentTour)
        // App.currentTour.finish();

        if (typeof (params) === 'undefined')
            params = {};

        var _hash = true;
        if (typeof (params.hash) !== 'undefined' && !params.hash) {
            _hash = false;
        }

        /// Trying to get view from stack
        var fromStack = viewStack.getView(pageName, params, _hash);

        // if same view just update
        if (typeof (this.page) !== 'undefined' && fromStack) {
            if (this.page.cid === fromStack.cid) {
                console.log('Updating current view %s', pageName);
                console.groupEnd();

                this.page.update(params);
                return true;
            }
        }

        // undelegate events from previous page
        if (typeof (this.page) !== 'undefined' && this.page) {
            console.log('sleep app.js', this.page.parts);
            this.page.sleep();
        }

        if (fromStack !== false) {
            /// Console log wake up page from stack
            console.log('Showing page from stack');

            this.page = fromStack;
            this.page.wakeUp();
            this.loadingStatus(false);

        } else {
            /// or create new one
            console.log('Creating new page');

            this.loadingStatus(true);
            this.page = new this.Views.Pages[pageName](params);
            this.page.on('loaded', function () {
                this.loadingStatus(false);
            }, this);

            if (this.page.isReady)
                this.loadingStatus(false);

            viewStack.addView(pageName, params, this.page, _hash);
        }
        console.groupEnd();

        return true;
    },
    setProgress: function (value) {
        if (!this.progress)
            this.progress = new Mprogress();

        if (typeof (value) === 'undefined') {
            if (this.progress.status === null)
                return this.progress.start();
            else
                return this.progress.inc();
        }
        if (value >= 1 || value === true)
            return this.progress.end();

        this.progress.set(value);
    },
    loadingStatus: function (status) {
        if (status) {
            console.log('app.js | Loading status = true');
            this.isLoading = true;
            // $('html').animate({
            //     opacity: 0
            // }, 1000);
            $('#preloader').stop().show();
        } else {
            console.log('app.js | Loading status = false');
            this.isLoading = false;
            $('html').animate({
                opacity: 1
            }, 1000);
            $('#preloader').stop().fadeOut('slow');
        }
    },
    renderLayoutBlocks: function () {

        if (this.header) {
            return;
        }

        var header = require('./app/view/header');
        this.header = new header();

        var that = this;
        var renderFunc = function () {
            that.header.render();
        };

        if ($.isReady) {
            renderFunc();
        } else {
            $(function () {
                renderFunc();
            });
        }
    },
};