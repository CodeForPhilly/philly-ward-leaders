var $ = jQuery = require('jquery');
var _ = require('underscore');
Backbone = require('backbone'); // must be on window for tabletopSync
Backbone.$ = $ || jQuery; // shim for marionette
var Marionette = require('backbone.marionette');
var Router = require('./router');
require('browsernizr/test/touchevents');
Modernizr = require('browsernizr'); // must be on window for foundation?

var layout = new Marionette.LayoutView({
     el: 'body',
     regions: {
          'main': '#main'
     }
});

var router = new Router({layout: layout});
Backbone.history.start();

$(document).foundation();
$(document).foundation('tooltip', 'reflow');
