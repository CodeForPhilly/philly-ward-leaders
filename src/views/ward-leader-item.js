var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  $ = require('jquery'),
  _ = require('underscore'),
  baseballCard = require('../baseball-card'),
  Template = require('../templates/ward-leader-item.html');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'flip-container',
  template: Template,
  onShow: function() {
    var photoOffset = parseInt(this.model.get('Photo Offset'), 10);
    if( ! photoOffset) photoOffset = null;

    var settings = $.extend({
      ward: this.model.get('wardOrdinal'),
      name: this.model.get('Name'),
      photoUrl: this.model.get('avatar'),
      photoOffset: photoOffset
    }, this.model.toJSON());

    if(this.model.get('Party') === 'R') settings.cardBorderColor = '#A12222';

    baseballCard.front(this.$('.front')[0], settings);
    baseballCard.back(this.$('.back')[0], settings);
  }
});
