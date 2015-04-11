var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  L = require('leaflet');

module.exports = Backbone.Marionette.ItemView.extend({
  template: false,
  className: 'ward-map',
  initialize: function() {
    router.divisionBoundaries.on('sync', this.addBoundaries, this);
  },
  onShow: function() {
    this.map = L.map(this.el).setView([39.9523893, -75.1636291], 10);
    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    }).addTo(this.map);

    this.addHome();

    if( ! _.isEmpty(router.divisionBoundaries.attributes)) {
      this.addBoundaries();
    }
  },
  addBoundaries: function() {
    var ward = ('00' + this.model.get('Ward')).slice(-2),
    boundaries = L.geoJson(router.divisionBoundaries.toJSON(), {
      filter: function(feature, layer) {
        return feature.properties.DIVISION_N.substring(0, 2) == ward;
      },
      onEachFeature: function(feature, layer) {
        if(feature.properties) {
          layer.bindPopup('Division: ' + feature.properties.DIVISION_N.substring(2));
        }
      }
    }).addTo(this.map);
    this.map.fitBounds(boundaries.getBounds());
  },
  addHome: function() {
    var homeGeometry = [this.model.get('Lat'), this.model.get('Lng')];
    if(homeGeometry[0] && homeGeometry[1]) {
      L.marker([this.model.get('Lat'), this.model.get('Lng')])
      .bindPopup('<b>Home Address</b><br>' + this.model.get('Address')).openPopup()
      .addTo(this.map);
    }
  }
});
