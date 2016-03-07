'use strict';
var $ = window.$ = window.jQuery = require('jquery');
var App = require('./../../../../app');
var social_config = require('./../../../social_config');
var templateManager = require('./../../../template_manager');
var ShareButton = require('./../../../../../../node_modules/share-button/dist/share-button.min.js');

var Backbone = require('backbone');
var videojs = window.videojs = require('video.js');

// itemView.js
var itemView = Backbone.View.extend({
    templateName: 'parts/show',
    userPaused: false,
    events: {
        "click .vjs-play-control": "pauseClick",
        // "click #demo_without_mouse_signup": "demoSignUp"
    },
    pauseClick: function () {
        /*alert('click');*/
        /*this.userPaused = !this.userPaused;*/
    },
    initialize: function (options) {
        this.$el.addClass('part_loading');
    },
    render: function (model) {
        /*        
         if (typeof (model.attributes.bind) === 'function') {
         model = model.attributes;
         }
         * */
        if (model.attributes.attributes) {
            model = model.attributes;
        }
        var data = {
            model: model
        };

        var self = this;

        templateManager.fetch(this.templateName, data, function (html) {

            self.$el.html(html);
            var video = self.getPlayer();

            video.on('ended', function () {
                self.trigger('show-ended');
            });

            self.$el.removeClass('part_loading');


            var sharer = new ShareButton(social_config);

            /*sharer.open();*/
            $('.fb-like').data('href', sharer.config.url);
            FB.XFBML.parse();

        });
    },
    play: function () {
        var player = this.getPlayer();

        var isPlaying = !player.paused();
        if (isPlaying) {
            return;
        }
        if (this.userPaused) {
            return;
        }

        player.play();
    },
    pause: function () {
        var player = this.getPlayer();

        player.pause();

    },
    getPlayer: function () {
        var video = videojs(document.getElementById('main-video'));
        return video;

    },
});

module.exports = itemView;
