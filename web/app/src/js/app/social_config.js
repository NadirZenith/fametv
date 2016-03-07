'use strict';

// social_config.js
var social_config = {
    //protocol: null, // the protocol you'd prefer to use. [Default: your current protocol]
    //url: null, // the url you'd like to share. [Default: `window.location.href`]
    //title: null, // title to be shared alongside your link [Default: See below in defaults section]
    //description: null, // text to be shared alongside your link, [Default: See below in defaults section]   
    //image: null, // image to be shared [Default: See below in defaults section]
    ui: {
        //flyout: null, // change the flyout direction of the shares. chose from `top left`, `top center`, `top right`, `bottom left`, `bottom right`, `bottom center`, `middle left`, or `middle right` [Default: `top center`]
        //flyout: 'bottom left',
        button_font: false, // include the Lato font set from the Google Fonts API. [Default: `true`]
        //buttonText: 'Partilhar', // change the text of the button, [Default: `Share`]
        icon_font: false, // include the minified Entypo font set. [Default: `true`]
    },
    networks: {
        googlePlus: {
            enabled: true, // Enable Google+. [Default: true]
            url: null, // the url you'd like to share to Google+ [Default: config.url]
        },
        twitter: {
            enabled: true, // Enable Twitter. [Default: true]
            //url: null, // the url you'd like to share to Twitter [Default: config.url]
            //description: null, // text to be shared alongside your link to Twitter [Default: config.description]
        },
        facebook: {
            enabled: true, // Enable Facebook. [Default: true]
            load_sdk: false, // Load the FB SDK. If false, it will default to Facebook's sharer.php implementation. 
            // NOTE: This will disable the ability to dynamically set values and rely directly on applicable Open Graph tags.
            // [Default: true]
            //url: null, // the url you'd like to share to Facebook [Default: config.url]
            //app_id: null, // Facebook app id for tracking shares. if provided, will use the facebook API
            //title: null, // title to be shared alongside your link to Facebook [Default: config.title]
            //caption: null, // caption to be shared alongside your link to Facebook [Default: null]
            //description: null, // text to be shared alongside your link to Facebook [Default: config.description]
            //image: null, // image to be shared to Facebook [Default: config.image]
        },
        pinterest: {
            enabled: true, // Enable Pinterest. [Default: true]
            //url: null, // the url you'd like to share to Pinterest [Default: config.url]
            //image: null, // image to be shared to Pinterest [Default: config.image]
            //description: null, // text to be shared alongside your link to Pinterest [Default: config.description]
        },
        reddit: {
            enabled: false, // Enable Reddit. [Default: true]
            //url: null, // the url you'd like to share to Reddit [Default: config.url]
            //title: null, // title to be shared alongside your link to Reddit [Default: config.title]
        },
        linkedin: {
            enabled: false, // Enable LinkedIn. [Default: true]
            //url: null, // the url you'd like to share to LinkedIn [Default: config.url]
            //title: null, // title to be shared alongside your link to LinkedIn [Default: config.title],
            //description: null, // text to be shared alongside your link to LinkedIn [Default: config.description]
        },
        whatsapp: {
            enabled: true, // Enable WhatsApp. [Default: true]
            //description: null, // text to be shared alongside your link to WhatsApp [Default: config.description],
            //url: null, // the url you'd like to share to WhatsApp [Default: config.url]
        },
        email: {
            enabled: false, // Enable Email. [Default: true]
            //title: null, // the subject of the email [Default: config.title]
            //description: null, // The body of the email [Default: config.description]
        }
    }
};


module.exports = social_config;