var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  _ = require('underscore'),
  Template = require('../templates/ward-leader-item.html'),
  util = require('../util');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: Template,
  className: 'flip-container',
  initialize: function() {
    _.bindAll(this, 'onFlip');
  },
  templateHelpers: {
    partyPlural: util.partyPlural
  },
  onFlip: function(e) {
    this.$('.stats').toggle();
  },
  onRender: function() {
    this.$el.foundation('tooltip', 'reflow');
  }
});
