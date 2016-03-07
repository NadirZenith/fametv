'use strict';

var settings = require('./settings');

function buildHash(hash, params) {
    if (typeof (params) !== 'undefined') {
        for (var k in params) {
            if (typeof (params[k].id) !== 'undefined')
                hash += '-' + k + '_id' + params[k].id;
            else
                hash += '-' + k + '_' + params[k];
        }
    }
    return hash;
}

// view_stack.js
module.exports = {
    stack: {},
    inStackCount: 0,
    addView: function (name, params, view, full_hash) {
        if (!settings.enablePagesStack)
            return false;

        full_hash = typeof full_hash !== 'undefined' ? full_hash : true;

        var hash = name;
        if (full_hash) {
            hash = buildHash(hash, params);
        }

        /*console.log('addView | hash: %s', hash);*/
        this.stack[hash] = {
            view: view,
            hash: hash,
            added: new Date()
        };
        this.inStackCount++;
        this.removeOldestIfNeeded();
        return true;
    },
    getView: function (name, params, full_hash) {
        if (!settings.enablePagesStack)
            return false;

        full_hash = typeof full_hash !== 'undefined' ? full_hash : true;


        var hash = name;
        if (full_hash) {
            hash = buildHash(hash, params);
        }

        if (typeof (this.stack[hash]) !== 'undefined')
            return this.stack[hash].view;
        else
            return false;
    },
    clear: function () {
        this.stack = {};
        this.inStackCount = 0;
    },
    removeOldestIfNeeded: function () {
        var maxElements = settings.pagesStackMaxLength;

        if (this.inStackCount <= maxElements)
            return;

        var sort = [];
        for (var k in this.stack)
            sort.push({
                hash: this.stack[k].hash,
                added: this.stack[k].added
            });

        sort.sort(function (a, b) {
            return a.added - b.added;
        });
        /*console.log("Removing " + sort[0].hash + " from pages stack");*/
        delete this.stack[sort[0].hash];
        this.inStackCount--;
    }
};

