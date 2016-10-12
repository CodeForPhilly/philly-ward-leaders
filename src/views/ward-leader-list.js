var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  $ = require('jquery'),
  _ = require('underscore'),
  Template = require('../templates/ward-leader-list.html'),
  WardLeaderItemView = require('../views/ward-leader-item'),
  util = require('../util');
require('foundation-sites');
require('foundation-sites/js/foundation/foundation.dropdown');

module.exports = Backbone.Marionette.CompositeView.extend({
  template: Template,
  childView: WardLeaderItemView,
  childViewContainer: '#leaders',
  initialize: function() {
    _.bindAll(this, 'onSort', 'onSearch');
  },
  events: {
    'click [data-sort-key]': 'onSort',
    'click [data-party]': 'onSwitchParty',
    'click [data-toggle]': 'onToggle',
    'submit form': 'onSearch',
    'click [data-clear]': 'onSearch'
    //'touchstart .flip-container': 'onFlip'
  },
  serializeData: function() {
    return $.extend({
      sortKey: this.collection.sortKey,
      searchQuery: this.searchQuery,
      party: this.collection.party
    }, this.collection.toJSON());
  },
  onRender: function() {
    this.$el.foundation('dropdown', 'reflow');
  },
  onSort: function(e) {
    // Resort collection
    this.collection.sortKey = $(e.currentTarget).data('sort-key');
    this.collection.comparator = this.collection.comparators[this.collection.sortKey];
    this.collection.sort();
    e.preventDefault();
  },
  onSearch: function(e) {
    this.searchQuery = $(e.currentTarget).attr('data-clear') !== undefined ? '' : this.$('.query').val();
    this.render();
    e.preventDefault();
  },
  onToggle: function(e) {
    var selector = $(e.currentTarget).data('toggle');
    $(selector).toggleClass('hide');
    $('input', $(selector))[0].focus();
    e.preventDefault();
  },
  onSwitchParty: function(e) {
    this.collection.party = $(e.currentTarget).data('party');
    this.render();
    e.preventDefault();
  },
  onFlip: function(e) {
    $(e.currentTarget).toggleClass('hover');
  },
  filter: function(child, index, collection) {
    return child.get('Party') === this.collection.party && (this.searchQuery ? (util.stringContains(this.searchQuery, child.get('Name')) || util.stringContains(this.searchQuery, child.get('Ward').toString())) : true);
  }
});
