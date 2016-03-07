'use strict';

var settings = require('./settings');
var $ = require('jquery');
var localStorage = require('./local_storage');
var _ = require('underscore');
var moment = require('moment');
require('moment/locale/pt');

// template_manager.js
var templateManager = {
    _cache: {},
    _templates: {},
    _loadingStates: {},
    _loadingCallbacks: {},
    _initialized: false,
    initialize: function () {

        _.template.formatdate = function (stamp) {

            return moment(stamp).format('L');

        };

        this._initialized = true;
    },
    commonData: function () {
        return {
            settings: _.extend(settings, {
                site_path: settings.sitePath,
                client_side: true,
                invite_mode: settings.inviteMode
            })
        };
    },
    fetch: function (name, data, success) {
        if (!this._initialized)
            this.initialize();

        data = _.extend(data, this.commonData());

        if (typeof (this._templates[name]) !== 'undefined' || this.tryToLoadFromStorage(name)) {
            var res = this._templates[name](data);
            if (typeof (success) === 'function')
                success(res);
            return res;
        }

        var that = this;
        if (typeof (success) === 'function') {
            if (typeof (this._loadingStates[name]) !== 'undefined' && this._loadingStates[name] === 'loading') {
                // already fetched
                if (typeof (this._loadingCallbacks[name]) === 'undefined') {
                    this._loadingCallbacks[name] = [];
                }

                this._loadingCallbacks[name].push(function (tpl) {
                    success(tpl(data));
                });

            } else {
                // fetch template
                this.loadFromServer(name, function (tpl) {

                    success(tpl(data));
                });
            }

        } else {
            this.loadFromServer(name);
        }

        return false;
    },
    tryToLoadFromStorage: function (name) {
        if (!settings.enableTemplatesCache) {
            /*console.log('%cTemplates cache is disabled', 'color: red');*/
            return false;
        }

        if (!localStorage.isSupported()) {
            /*console.log('Local storage is disabled', 'color: red');*/
            return false;
        }

        var data = localStorage.get('app_templates_' + name);
        if (data) {
            this._cache[name] = data;
            this._templates[name] = _.template(data);
            this._loadingStates[name] = 'ready';

            return true;
        }

        return false;
    },
    loadFromServer: function (name, callback) {

        this._loadingStates[name] = 'loading';
        var that = this;
        var templateName = name;
        var callbackFunc = callback;

        var process = function (data) {

            if (data) {
                localStorage.set('app_templates_' + templateName, data);
                that._cache[templateName] = data;
                that._templates[templateName] = _.template(data);
                that._loadingStates[templateName] = 'ready';

                if (typeof (callbackFunc) === 'function')
                    callbackFunc(that._templates[templateName]);

                if (typeof (that._loadingCallbacks[templateName]) !== 'undefined') {
                    for (var k in that._loadingCallbacks[templateName])
                        that._loadingCallbacks[templateName][k](that._templates[templateName]);

                    that._loadingCallbacks[templateName] = [];
                }
            }
        };

        var use_cache = true;
        if (!settings.enableTemplatesCache)
            use_cache = false;

        $.ajax({
            url: settings.templatePath + name,
            data: {},
            success: process,
            dataType: 'html',
            mimeType: 'text/plain',
            cache: use_cache
        });
    }

};

module.exports = templateManager;