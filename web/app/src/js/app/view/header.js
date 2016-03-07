'use strict';
var Backbone = require('backbone');
var $ = window.$ = window.jQuery = require('jquery');

// header.js
module.exports = Backbone.View.extend({
    el: $("#header"),
    initialize: function () {

        var $navbar = $(".navbar-fixed-top");
        $(window).scroll(function () {
            if ($(".navbar").offset().top > 50) {
                // $body.addClass('show-list');
                $navbar.addClass("top-nav-collapse");
            } else {
                // $body.removeClass('show-list');
                // $body.removeClass('show-video');
                $navbar.removeClass("top-nav-collapse");
            }
        });

        var winSize = '';
        window.onresize = onWindowResize;
        function onWindowResize() {
            var windowWidth = $(this).width();
            var newWinSize = 'xs'; // default value, check for actual size
            if (windowWidth >= 1200) {
                newWinSize = 'lg';
            } else if (windowWidth >= 992) {
                newWinSize = 'md';
            } else if (windowWidth >= 768) {
                newWinSize = 'sm';
            }
            if (newWinSize !== winSize) {
                winSize = newWinSize;
            }
        }
        onWindowResize();

        //hide navbar on menu click(only on mobiles| xs)
        $('.nav a').on('click', function () {
            if (winSize === 'xs') {
                $('.navbar-toggle').click();
            }
        });
    },
    events: {
        // "click .nav.navbar-nav a": 'menuClick'
    },
    menuClick: function () {
        alert('clicked');
    },
    render: function () {
        this.setElement($("#header"));

        // if (App.currentUser.isSignedIn()) {
        // 	console.log('header.js | Rendering for signed in user');

        // 	this.$('.header_is_not_signed_in').hide();
        // 	this.$('.header_is_signed_in').show();
        // } else {
        // 	console.log('header.js | Rendering for not signed in user');
        // 	this.$('.header_is_not_signed_in').show();
        // 	this.$('.header_is_signed_in').hide();
        // }


        // $(".menu_category").parent().removeClass('active');
        // if (typeof(App.page) !== 'undefined' && App.page && typeof(App.page.category) !== 'undefined') {
        // 	$(".menu_category_" + App.page.category).parent().addClass('active');
        // } else {
        // 	$(".menu_category_home").parent().addClass('active');
        // }


        /*console.log('header.js | Header rendered');*/
        return this;
    }
});