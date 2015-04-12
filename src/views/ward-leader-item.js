var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  _ = require('underscore'),
  baseballCard = require('../baseball-card');
  Template = require('../templates/ward-leader-item2.html');

module.exports = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: Template,
  onShow: function() {
    baseballCard.front(this.$('.front2')[0], {
      ward: this.model.get('wardOrdinal'),
      name: this.model.get('Name'),
      photoUrl: this.model.get('Photo')
    });

    baseballCard.back(this.$('.front2')[0], {
      ward: this.model.get('wardOrdinal'),
      name: this.model.get('Name'),
      photoUrl: this.model.get('Photo')
    });
  }
});
