var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  CommitteePersonItemView = require('../views/committee-person-item');

module.exports = Backbone.Marionette.CollectionView.extend({
  childView: CommitteePersonItemView,
  tagName: 'ul',
  className: 'small-block-grid-1 medium-block-grid-2 large-block-grid-3'
});
