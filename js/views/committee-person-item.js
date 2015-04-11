var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  Template = require('../templates/committee-person-item.html');

module.exports = Backbone.Marionette.ItemView.extend({
  template: Template,
  tagName: 'li'
});
