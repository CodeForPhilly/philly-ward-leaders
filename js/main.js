var config = {
     spreadsheet: 'https://docs.google.com/spreadsheets/d/1nkkFQUaxcGa0oDPWl1Vr1cknToIq8FxfJ7CILQrFgBM/pubhtml',
     feedbackUrl: $('#feedback-link').attr('href')
},
     storage = Tabletop.init( { key: config.spreadsheet, wait: true } );
_.templateSettings.variable = 'data';
     
var layout = new Marionette.LayoutView({
     el: 'body',
     regions: {
          'main': '#main'
     }
});

var WardLeader = Backbone.Model.extend({
     // Gets called on each ward leader model in the collection
     initialize: function() {
          // Convert to numbers
          var self = this,
               attributes = ['Democrats Registered', 'Total Registered', 'Turnout 2014 General'];
          attributes.forEach(function(attribute) {
               self.set(attribute, parseInt(self.get(attribute), 10));
          });
          
          // Calculate vacancies
          var divisions = parseInt(this.get('Divisions'), 10),
               committeePeople = parseInt(this.get('Committee People'), 10);
          this.set('vacancies', divisions * 2 - committeePeople);
          
          this.set('wardOrdinal', getOrdinal(this.get('Ward')));
          
          // Calculate turnout percentage
          var turnout = this.get('Turnout 2014 General'),
               registered = this.get('Total Registered');
          this.set('turnoutPercentage', Math.round(turnout / registered * 100));
          
          // Set default photo if no photo provided
          this.set('avatar', this.get('Photo') ? this.get('Photo') : this.get('Gender') === 'F' ? 'img/avatar-female.png' : 'img/avatar-male.png');
          
          // Set URL slug
          this.set('slug', this.get('Name').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
     }
});

var comparators = {
     voters: function(item) {
          return -item.get('Total Registered');
     },
     turnout: function(item) {
          return -item.get('turnoutPercentage');
     },
     vacancies: function(item) {
          return -item.get('vacancies');
     }
};

var WardLeaders = Backbone.Collection.extend({
     model: WardLeader,
     tabletop: {
          instance: storage,
          sheet: 'Democratic'
     },
     sync: Backbone.tabletopSync,
     filter: 'voters',
     comparator: comparators.voters
});

var TopLeadersItemView = Backbone.Marionette.ItemView.extend({
     tagName: 'li',
     template: '#tmpl-top-leaders-item',
     initialize: function() {
          _.bindAll(this, 'onDetails');
     },
     events: {
          'click [data-ward]': 'onDetails'
     },
     onDetails: function(e) {
          var ward = this.model.get('Ward'),
               slug = this.model.get('slug');
          router.navigate(ward + '/' + slug, {trigger: true});
          e.preventDefault();
     }
});

var TopLeadersView = Backbone.Marionette.CompositeView.extend({
     template: '#tmpl-top-leaders',
     childView: TopLeadersItemView,
     childViewContainer: '#leaders',
     initialize: function() {
          _.bindAll(this, 'onSort', 'onSearch');
     },
     events: {
          'click [data-sort-key]': 'onSort',
          'click [data-toggle]': 'onToggle',
          'submit form': 'onSearch',
          'click [data-clear]': 'onSearch'
     },
     serializeData: function() {
          return $.extend({
               sortKey: this.collection.sortKey,
               searchQuery: this.searchQuery
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
     },
     filter: function(child, index, collection) {
          return this.searchQuery ? (stringContains(this.searchQuery, child.get('Name')) || stringContains(this.searchQuery, child.get('Ward'))) : true;
     }
});

var stringContains = function(needle, haystack) {
     return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
};

var DetailsView = Backbone.Marionette.LayoutView.extend({
     template: '#tmpl-details',
     regions: {
          'map': '.ward-map-container'
     },
     serializeData: function() {
          return $.extend({
               errorLink: function(field) {
                    var params = {
                         thePage: Backbone.history.getFragment(),
                         whatHappened: 'I found a content or data error'
                    };
                    if(field) params.tellUs = field + ' should be: ';
                    return config.feedbackUrl + '?' + $.param(params).replace(/\+/g, '%20');
               }
          }, this.model.toJSON());
     },
     onShow: function() {
          this.mapView = new WardMapView({
               model: this.model
          });
          this.getRegion('map').show(this.mapView);
     }
});

var WardMapView = Backbone.Marionette.ItemView.extend({
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

var CityMapView = Backbone.Marionette.ItemView.extend({
     template: false,
     className: 'city-map',
     initialize: function() {
          router.wardBoundaries.on('sync', this.addBoundaries, this);
          this.collection.on('sync', this.addBoundaries, this);
          this.popupTemplate = _.template($('#tmpl-city-map-popup').html());
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
          
          // Search geocoder
          new L.Control.GeoSearch({
               provider: new L.GeoSearch.Provider.Google(),
               position: 'topcenter',
               showMarker: true
          }).addTo(this.map);
          
          // GPS Locator
          L.control.locate({
               icon: 'fa fa-location-arrow',
               metric: false,
               locateOptions: {
                    maxZoom: 16
               }
          }).addTo(this.map);
          
          this.addBoundaries();
     },
     addBoundaries: function() {
          // If both ward boundaries and ward leaders have been fetched
          if( ! _.isEmpty(router.wardBoundaries.attributes) && this.collection.length) {
               var self = this;
               window.boundaries = L.geoJson(router.wardBoundaries.toJSON(), {
                    onEachFeature: function(feature, layer) {
                         if(feature.properties) {
                              //layer.bindPopup(getOrdinal(feature.properties.WARD_NUM) + ' Ward');
                              var model = self.collection.findWhere({Ward: feature.properties.WARD_NUM});
                              if(model) {
                                   layer.bindPopup(self.popupTemplate(model.toJSON()));
                              }
                         }
                    }
               }).addTo(this.map);
               this.map.fitBounds(window.boundaries.getBounds());
          }
     }
});

var getOrdinal = function(n) {
     var s=["th","st","nd","rd"],
          v=n%100;
     return n+(s[(v-20)%10]||s[v]||s[0]);
};

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

var Router = Backbone.Router.extend({
     routes: {
          "": "showTopLeaders",
          ":ward/:slug": "detailsRoute",
          "map": "map"
     },
     initialize: function() {
          $('#intro').foundation('reveal', 'open');
          this.divisionBoundaries = new Backbone.Model();
          this.divisionBoundaries.fetch({url: 'data/Political_Divisions.geojson'});
          
          this.wardLeaders = new WardLeaders();
          NProgress.start();
          this.wardLeaders.fetch({
               success: function(collection) {
                    NProgress.done();
               }
          });
     },
     showTopLeaders: function() {
           topLeadersView = new TopLeadersView({
               collection: this.wardLeaders
          });
          layout.getRegion('main').show(topLeadersView);
          $(window).scrollTop(0);
     },
     detailsRoute: function(ward, slug) {
          if(this.wardLeaders.length) {
               var model = this.wardLeaders.findWhere({Ward: ward, slug: slug});
               this.showDetails(model);
          } else {
               var self = this;
               this.wardLeaders.on('sync', function() {
                    var model = self.wardLeaders.findWhere({Ward: ward});
                    self.showDetails(model);
               });
          }
     },
     showDetails: function(model) {
          var detailsView = new DetailsView({ model: model });
          layout.getRegion('main').show(detailsView);
          $(window).scrollTop(0);
     },
     map: function() {
          if( ! this.wardBoundaries) {
               this.wardBoundaries = new Backbone.Model();
               this.wardBoundaries.fetch({url: 'data/Political_Wards.geojson'});
          }
          
          var cityMapView = new CityMapView({collection: this.wardLeaders});
          layout.getRegion('main').show(cityMapView);
          $(window).scrollTop(0);
     }
});
var router = new Router();
Backbone.history.start();

$(document).foundation();
$(document).foundation('tooltip', 'reflow');
$('[data-reveal-close]').click(function(e) {
     var selector = $(e.currentTarget).data('reveal-close');
     $(selector).foundation('reveal', 'close');
     e.preventDefault();
})