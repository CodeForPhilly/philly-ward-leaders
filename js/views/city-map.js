var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  _ = require('underscore'),
  L = require('leaflet'),
  Template = require('../templates/city-map.html'),
  PopupTemplate = require('../templates/city-map-popup.html');
require('leaflet.locatecontrol');
require('Leaflet.GeoSearch');
require('Leaflet.GeoSearch/src/js/l.geosearch.provider.google');

module.exports = Backbone.Marionette.ItemView.extend({
  template: Template,
  className: 'city-map',
  title: 'Ward Map',
  initialize: function(options) {
    this.wardBoundaries = options.wardBoundaries;
    this.wardBoundaries.on('sync', this.addBoundaries, this);
    this.collection.on('sync', this.addBoundaries, this);
    this.popupTemplate = PopupTemplate;
  },
  onShow: function() {
    this.map = L.map(this.$('.city-map-container')[0]).setView([39.9523893, -75.1636291], 10);
    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    }).addTo(this.map);

    // Search geocoder
    new L.Control.GeoSearch({
      provider: new L.GeoSearch.Provider.Google(),
      position: 'topcenter',
      showMarker: true,
      zoomLevel: 14
    }).addTo(this.map);

    // GPS Locator
    L.control.locate({
      icon: 'fa fa-location-arrow',
      metric: false,
      showPopup: false,
      locateOptions: {
        maxZoom: 14
      }
    }).addTo(this.map);

    this.addBoundaries();
  },
  addBoundaries: function() {
    // If both ward boundaries and ward leaders have been fetched
    if( ! _.isEmpty(this.wardBoundaries.attributes) && this.collection.length) {
      var self = this,
      colors = function(d) {
        return d >= 80 ? '#eff3ff' :
        d >= 60 ? '#bdd7e7' :
        d >= 40 ? '#6baed6' :
        d >= 20 ? '#bdd7e7' :
        '#eff3ff';
      };
      window.boundaries = L.geoJson(this.wardBoundaries.toJSON(), {
        onEachFeature: function(feature, layer) {
          if(feature.properties) {
            //layer.bindPopup(getOrdinal(feature.properties.WARD_NUM) + ' Ward');
            var models = self.collection.where({Ward: +feature.properties.WARD_NUM});
            if(models.length) {
              layer.bindPopup(self.popupTemplate(models.map(function(obj) { return obj.toJSON(); })));
            }
          }
        },
        style: function(feature) {
          var model = self.collection.findWhere({Ward: +feature.properties.WARD_NUM});
          return {
            fillColor: colors(model ? model.get('turnoutPercentage') : 0),
            fillOpacity: 0.7,
            weight: 3,
            color: '#2284a1'
          };
        }
      }).addTo(this.map);
      this.map.fitBounds(window.boundaries.getBounds());
    }
  }
});

// Override geocode functionality to append city
var geosearchCopy = L.Control.GeoSearch.prototype.geosearch;
L.Control.GeoSearch.prototype.geosearch = function(qry) {
     geosearchCopy.call(this, qry + ', Philadelphia, PA');
};

// Override show location to show which ward
var showLocationCopy = L.Control.GeoSearch.prototype._showLocation;
L.Control.GeoSearch.prototype._showLocation = function(location) {
     showLocationCopy.call(this, location);
     var polygon = leafletPip.pointInLayer([location.X, location.Y], window.boundaries),
          popupTemplate = _.template($('#tmpl-city-map-popup').html()); // TODO: Add address to marker
     this._positionMarker.bindPopup(polygon[0]._popup).openPopup();
};

var drawMarkerCopy = L.Control.Locate.prototype.drawMarker;
L.Control.Locate.prototype.drawMarker = function(map) {
     drawMarkerCopy.call(this, map);
     var polygon = leafletPip.pointInLayer(this._event.latlng, window.boundaries),
          popupTemplate = _.template($('#tmpl-city-map-popup').html()); // TODO: Add address to marker
     this._marker.bindPopup(polygon[0]._popup).openPopup();
};
