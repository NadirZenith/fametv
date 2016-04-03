'use strict';
var $ = window.$ = window.jQuery = require('jquery');
var App = require('./../../../app');
var AbstractPage = require('./../../abstract/page');
var Shows = require('./../../collection/shows');
var Show = require('./../../model/show');

/*var ListView = require('./../parts/index/listView');*/
var ItemView = require('./../parts/index/itemView');
// index.js
var SingleShow = AbstractPage.extend({
    templateName: 'pages/single_show',
    category: 'home',
    shows: null, //shows collection
    show: null, //show model
    player_active: true,
    autoplay: true,
    resetFilters: function () {
        var $filters = $('.filters button');
        $filters.each(function () {
            $(this).removeClass('active');
        });
        $('#search-input').val('');
        this.shows.queryParams.collection = null;
        this.shows.queryParams.search = null;
    },
    initialize: function (params) {
        window.scrollTo(0, 0);
        this.renderLoading();
        var self = this;
        self.show = new Show();
        self.shows = new Shows();

        if (params.id) {
            self.show.set("id", params.id);
        }

        var $body = $('body');
        this.on('index:show-video', function () {
            $body.removeClass('hide-video');
        });
        /*        
         this.on('index:hide-video', function () {
         $body.addClass('hide-video');
         });
         * */
        this.on('render', this.domEvents);
        this.render();
    },
    title: function () {
        var title = 'Homepage';

        if (this.show) {
            var show = this.show;

            if (this.show.attributes.attributes) {
                show = this.show.attributes;
            }

            if (show && show.get('title') !== null) {
                title = show.get('title');
            }
        }
        return title;
    },
    render: function () {
        this.renderHTML({});
        this.showVideo();
    },
    domEvents: function () {
        var self = this;

        //Item View
        self.parts.itemView = new ItemView({
            el: '#showItem'
        });
        /*self.parts.itemView.on('show-ended', self.onVideoEnded, self);*/

        this.shows.on('reset', function (evt, options) {
            self.show = self.shows.getFirst();
            self.parts.itemView.render(self.show);
        });
        this.shows.getFirstPage({fetch: true, reset: true, resetState: true});
        this.showVideo();
    },
    onVideoEnded: function () {
        if (this.player_active && this.autoplay) {
            var model = this.shows.getNext(this.show);
            if (model) {
                var Router = require('./../../router');
                var href = '/show/' + model.get('id');
                Router.navigate(href, {
                    trigger: true
                });
            }
        }
    },
    sleep: function () {
        this.shows.reset();
        /*this.resetFilters();*/
        this.player_active = false;
        /*alert('sleep');*/

        /*$(window).off('scroll.index');*/
        AbstractPage.prototype.sleep.call(this /*, args...*/);
    },
    update: function (params) {

        if (params.id === false) {
            window.scrollTo(0, 0);
            //update to top
        } else {

            var model = this.shows.getById(params.id);
            if (model) {
                this.show = model;
                this.parts.itemView.render(this.show);

            }

        }
        this.showVideo();
        this.setTitle();

    },
    showVideo: function () {
        this.player_active = true;
        this.trigger('index:show-video');
    },
});
module.exports = SingleShow;
