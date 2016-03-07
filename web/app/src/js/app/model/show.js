'use strict';

var settings = require('./../settings');
var Backbone = require('backbone');

// show.js
var Show = Backbone.Model.extend({
    defaults: {
        title: null,
        slug: null,
        publication_date_start: null,
        created_at: null,
        udpated_at: null,
        video: {}
    },
    getTotal: function () {
        // return parseFloat(this.get('total'), 10);
    },
    url: function () {
        //api
        return settings.apiEntryPoint + 'shows/posts/' + this.id + '.json';

        //dev
        return settings.apiEntryPoint + 'shows.php?id=' + this.id;
    },
});

module.exports = Show; 