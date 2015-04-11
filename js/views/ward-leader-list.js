var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  _ = require('underscore'),
  Template = require('../templates/ward-leader-list.html'),
  WardLeaderItemView = require('../views/ward-leader-item'),
  util = require('../util');

module.exports = Backbone.Marionette.CompositeView.extend({
  template: Template,
  childView: WardLeaderItemView,
  childViewContainer: '#leaders',
  party: 'D',
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
      party: this.party
    }, this.collection.toJSON());
  },
  onRender: function() {
    this.$el.foundation('dropdown', 'reflow');
  },
  onSort: function(e) {
    // Resort collection
    this.collection.sortKey = $(e.currentTarget).data('sort-key');
    this.collection.comparator = comparators[this.collection.sortKey];
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
    this.party = $(e.currentTarget).data('party');
    this.render();
    e.preventDefault();
  },
  onFlip: function(e) {
    $(e.currentTarget).toggleClass('hover');
  },
  filter: function(child, index, collection) {
    return child.get('Party') === this.party && (this.searchQuery ? (util.stringContains(this.searchQuery, child.get('Name')) || util.stringContains(this.searchQuery, child.get('Ward').toString())) : true);
  }
});
