var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  Router = require('./router');
var Modernizr = require('browsernizr');
require('foundation');

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
