var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  Template = require('../templates/ward-leader-details.html'),
  CommitteePersons = require('../collections/committee-persons'),
  CommitteePersonsView = require('../views/committee-person-list'),
  WardMapView = require('./ward-map'),
  util = require('../util');
require('foundation-sites');
require('foundation-sites/js/foundation/foundation.tooltip');

module.exports = Backbone.Marionette.LayoutView.extend({
  template: Template,
  regions: {
    'map': '.ward-map-container',
    'committeePersons': '.committee-persons-container'
  },
  initialize: function(options) {
    this.divisionBoundaries = options.divisionBoundaries;
    this.committeePersons = new CommitteePersons(null, { ward: this.model.get('Ward'), party: this.model.get('Party') });
    this.committeePersons.fetch();
    this.committeePersons.on('sync', this.showCommmitteePersonsView, this);
  },
  templateHelpers: {
    errorLink: util.errorLink,
    partyName: util.partyName
  },
  onRender: function() {
    if(this.model.get('Name')) this.title = this.model.get('Name');
    this.$el.foundation('tooltip', 'reflow');
    this.showCommmitteePersonsView();
  },
  onShow: function() {
    this.showMapView();
  },
  showMapView: function() {
    this.mapView = new WardMapView({ model: this.model, divisionBoundaries: this.divisionBoundaries });
    this.getRegion('map').show(this.mapView);
  },
  showCommmitteePersonsView: function() {
    this.committeePersonsView = new CommitteePersonsView({ collection: this.committeePersons });
    this.getRegion('committeePersons').show(this.committeePersonsView);
  }
});
