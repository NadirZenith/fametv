'use strict';
var $ = window.$ = window.jQuery = require('jquery');
var App = require('./../../../app');
var AbstractPage = require('./../../abstract/page');
var Shows = require('./../../collection/shows');
var Show = require('./../../model/show');

var ListView = require('./../parts/index/listView');
var ItemView = require('./../parts/index/itemView');
// index.js
var Index = AbstractPage.extend({
    templateName: 'pages/index',
    category: 'home',
    shows: null, //shows collection
    show: null, //show model
    /*current_show_id: false,*/
    player_active: true,
    loading_more: false,
    autoplay: true,
    events: {
        "click .filters button.list-group-item": "filterCollection",
        "click .filters button.search": "filterSearch",
        "keyup .filters #search-input": "filterSearch"
                /*"click .load-more": "loadMore",*/
    },
    filterCollection: function (e) {
        e.preventDefault();
        this.resetFilters();
        var $btn = $(e.currentTarget);
        $btn.addClass('active');

        this.parts.listView.setLoading(true);
        var filter = $btn.data('filter');
        if (filter) {
            this.shows.queryParams.collection = filter;
        }
        this.shows.getFirstPage({fetch: true, reset: true, resetState: true});

    },
    filterSearch: function (e) {
        if (e.keyCode === 13 || e.type === "click") {
            this.parts.listView.setLoading(true);
            e.preventDefault();
            var val = $('#search-input').val();
            this.resetFilters();
            this.shows.queryParams.search = encodeURIComponent(val);
            this.shows.getFirstPage({fetch: true, reset: true, resetState: true});
        }

    },
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
            /*this.current_show_id = params.id;*/
            self.show.set("id", params.id);
        }

        var $body = $('body');
        this.on('index:show-video', function () {
            $body.removeClass('hide-video');
        });
        this.on('index:hide-video', function () {
            $body.addClass('hide-video');
        });
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
        this.initializeParts();
        var self = this;
        var $navbar = $(".navbar");
        var $window = $(window);
        var $document = $(document);
        $window.on('scroll.index', function () {

            if ($navbar.offset().top > 50) {
                self.showList();
            } else {
                self.showVideo();
            }

            if ($window.scrollTop() + $window.height() > $document.height() - 100) {
                self.loadMore();
            }
        });
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
        this.resetFilters();
        this.player_active = false;
        /*alert('sleep');*/

        $(window).off('scroll.index');
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
    /**
     * show video area triggers events
     * */
    showVideo: function () {
        this.player_active = true;
        this.trigger('index:show-video');
    },
    /**
     * show list area triggers events
     * hide video
     * */
    showList: function () {
        this.player_active = false;
        this.trigger('index:hide-video');
    },
    initializeParts: function () {
        var self = this;

        //Item View
        self.parts.itemView = new ItemView({
            el: '#showItem',
            /*model: self.show*/
        });
        self.parts.itemView.on('show-ended', self.onVideoEnded, self);

        if (!this.show.isNew()) {
            this.show.fetch({
                success: function (model, attributes) {
                    self.show = model;
                    self.parts.itemView.render(self.show);
                    /*self.shows.add(self.show,{merge: true});*/
                }
            });
        }

        //List View
        self.parts.listView = new ListView({
            el: '#showsList',
            collection: self.shows
        });

        this.shows.on('reset', function (evt, options) {
            if (self.show.isNew()) {
                self.show = self.shows.getFirst();
                self.parts.itemView.render(self.show);
            }
        });
        this.shows.getFirstPage({fetch: true, reset: true, resetState: true});

    },
    createItemView: function (callback) {


    },
    createListView: function (callback) {
        var self = this;

    },
    loadMore: function () {
        var $listLoader = $('#list-loader');
        $listLoader.addClass('part_loading');

        var success = function () {
            $listLoader.removeClass('part_loading');

        };
        var error = function () {
            $listLoader.removeClass('part_loading').html($listLoader.data('end'));
            setTimeout(function () {
                $listLoader.fadeOut().html('').fadeIn();
            }, 3000);

        };

        this.parts.listView.loadNextPage(success, error);

    },
});
module.exports = Index;
