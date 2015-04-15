var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  _ = require('underscore'),
  baseballCard = require('../baseball-card');
  Template = require('../templates/ward-leader-item2.html');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'flip-container',
  template: Template,
  onShow: function() {
    baseballCard.front(this.$('.front')[0], {
      ward: this.model.get('wardOrdinal'),
      name: this.model.get('Name'),
      photoUrl: this.model.get('Photo')
    });

    baseballCard.back(this.$('.back')[0], $.extend({
      ward: this.model.get('wardOrdinal'),
      name: this.model.get('Name'),
      photoUrl: this.model.get('Photo')
    }, this.model.toJSON()));
  }
});
