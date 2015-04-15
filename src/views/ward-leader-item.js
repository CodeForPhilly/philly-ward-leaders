var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
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

    baseballCard.front(this.$('.front')[0], {
      ward: this.model.get('wardOrdinal'),
      name: this.model.get('Name'),
      photoUrl: this.model.get('avatar'),
      photoOffset: photoOffset
    });

    baseballCard.back(this.$('.back')[0], $.extend({
      ward: this.model.get('wardOrdinal'),
      name: this.model.get('Name'),
      photoUrl: this.model.get('avatar')
    }, this.model.toJSON()));

    this.$el.foundation('tooltip', 'reflow');
  }
});
