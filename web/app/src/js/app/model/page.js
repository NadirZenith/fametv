'use strict';

var settings = require('./../settings');
var Backbone = require('backbone');

// page.js
var Page = Backbone.Model.extend({
    defaults: {
        title: null,
        url: null,
        content: null,
    },
    url: function () {
        return settings.apiEntryPoint + 'page/pages/' + this.id + '.json';
    },
});

module.exports = Page; 