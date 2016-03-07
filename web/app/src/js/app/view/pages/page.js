'use strict';

var AbstractPage = require('./../../abstract/page');
var PageModel = require('./../../model/page');

// page.js
var Page = AbstractPage.extend({
    templateName: 'pages/page',
    category: 'page',
    title: function () {
        var title = 'Page';
        if (this.page && this.page.get('title') !== null) {
            title = this.page.get('title');
        }
        return title;
    },
    render: function () {
        var data = {
            page: this.page
        };
        this.renderHTML(data);
    },
    initialize: function (params) {
        this.renderLoading();
        var self = this;
        self.page = new PageModel();
        self.page.set("id", params.id);
        self.page.fetch({
            success: function () {
                self.render();
            }
        });

    }

});

module.exports = Page;