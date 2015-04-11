var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  _ = require('underscore'),
  Template = require('../templates/ward-leader-item.html');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: Template,
  className: 'flip-container',
  initialize: function() {
    _.bindAll(this, 'onFlip');
  },
  onFlip: function(e) {
    this.$('.stats').toggle();
  }
});
