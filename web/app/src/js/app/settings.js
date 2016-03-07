'use strict';
if (typeof (conf) === 'undefined') {
    throw new ReferenceError('Main conf not available', __filename);
}
var paths = {
    site: conf.site,
    rootPath: conf.root,
    apiEntryPoint: conf.api,
    templatePath: conf.tpl,
};
var debug = conf.debug;

// settings.js
var settings = {
    //site_path = //example.com
    // sitePath = http://example.com (:80)
    /*sitePath: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : ''),*/
    sitePath: paths.site,
    // rootPath = /web/app_dev.php
    rootPath: paths.rootPath,
    // apiEntryPoint = rootPath + '/api/
    apiEntryPoint: paths.apiEntryPoint,
    // templatePath = rootPath + '/js/tpls/
    templatePath: paths.templatePath,
    //
    version: (typeof (conf.ver) !== 'undefined') ? conf.ver : '',
    debug: debug,
    title: function (title) {
        return title + ' | ' + 'FameTV';
    },
    availiableLocales: {
        'default': {
            code: 'en',
            name: 'English',
            timeFormat: '12',
            dateFormat: 'mdy'
        },
        'pt': {
            name: 'Português',
            timeFormat: '24',
            dateFormat: 'dmy'
        }
    },
    enableTemplatesCache: false,
    enablePagesStack: true,
    pagesStackMaxLength: 25,
    history: {
        pushState: true,
        startSilent: false
    },
    site_path: paths.site,
    client_side: true,
};


var defaultConsole = {
    log: function () {
    },
    error: function () {
    },
    time: function () {
    },
    timeEnd: function () {
    },
    group: function () {
    },
    groupEnd: function () {
    }
};
window.debug = function (bool) {
    if (window.console) {
        var consoleHolder = console;

        if (!bool) {
            window.console = defaultConsole;

            return '- debug disabled -';
        } else {
            window.console = consoleHolder;
            return '- debug enabled -';
        }
    } else {
        window.console = defaultConsole;
        if (bool) {
            //no console available
        }
    }
};
window.debug(settings.debug);


module.exports = settings;