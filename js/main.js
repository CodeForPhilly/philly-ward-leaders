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
          
          // Last voted time ago
          this.set('lastVotedAgo', moment(new Date(this.get('Last Voted'))).fromNow());
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
     className: 'flip-container',
     initialize: function() {
          _.bindAll(this, 'onFlip');
     },
     onFlip: function(e) {
          this.$('.stats').toggle();
     }
     /*onDetails: function(e) {
          var ward = this.model.get('Ward'),
               slug = this.model.get('slug');
          router.navigate(ward + '/' + slug, {trigger: true});
          e.preventDefault();
     }*/
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
          //'touchstart .flip-container': 'onFlip'
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
          e.preventDefault();
     },
     onFlip: function(e) {
          $(e.currentTarget).toggleClass('hover');
     },
     filter: function(child, index, collection) {
          return this.searchQuery ? (stringContains(this.searchQuery, child.get('Name')) || stringContains(this.searchQuery, child.get('Ward'))) : true;
     }
});

var stringContains = function(needle, haystack) {
     return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
};

var errorLink = function(field) {
     var params = {
          thePage: Backbone.history.getFragment(),
          whatHappened: 'I found a content or data error'
     };
     if(field) params.tellUs = field + ' should be: ';
     return config.feedbackUrl + '?' + $.param(params).replace(/\+/g, '%20');
};

var DetailsView = Backbone.Marionette.LayoutView.extend({
     template: '#tmpl-details',
     regions: {
          'map': '.ward-map-container'
     },
     templateHelpers: {
          errorLink: errorLink
     },
     onRender: function() {
          this.$el.foundation('tooltip', 'reflow');
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
     template: '#tmpl-city-map',
     className: 'city-map',
     initialize: function() {
          router.wardBoundaries.on('sync', this.addBoundaries, this);
          this.collection.on('sync', this.addBoundaries, this);
          this.popupTemplate = _.template($('#tmpl-city-map-popup').html());
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
          if( ! _.isEmpty(router.wardBoundaries.attributes) && this.collection.length) {
               var self = this,
                    colors = function(d) {
                         return d >= 80 ? '#eff3ff' :
                              d >= 60 ? '#bdd7e7' :
                              d >= 40 ? '#6baed6' :
                              d >= 20 ? '#bdd7e7' :
                              '#eff3ff';
                    };
               window.boundaries = L.geoJson(router.wardBoundaries.toJSON(), {
                    onEachFeature: function(feature, layer) {
                         if(feature.properties) {
                              //layer.bindPopup(getOrdinal(feature.properties.WARD_NUM) + ' Ward');
                              var model = self.collection.findWhere({Ward: feature.properties.WARD_NUM});
                              if(model) {
                                   layer.bindPopup(self.popupTemplate(model.toJSON()));
                              }
                         }
                    },
                    style: function(feature) {
                         var model = self.collection.findWhere({Ward: feature.properties.WARD_NUM});
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
          "": "static",
          "list": "list",
          ":ward/:slug": "details",
          "map": "map",
          "learn": "learn",
          ":page": "static"
     },
     show: function(view) {
          layout.getRegion('main').show(view);
          $(window).scrollTop(0);
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
     list: function() {
          this.show(new TopLeadersView({ collection: this.wardLeaders }));
     },
     details: function(ward, slug) {
          if(this.wardLeaders.length) {
               var model = this.wardLeaders.findWhere({Ward: ward, slug: slug});
               this.show(new DetailsView({ model: model }));
          } else {
               var self = this;
               this.wardLeaders.on('sync', function() {
                    var model = self.wardLeaders.findWhere({Ward: ward});
                    self.show(new DetailsView({ model: model }));
               });
          }
     },
     map: function() {
          if( ! this.wardBoundaries) {
               this.wardBoundaries = new Backbone.Model();
               this.wardBoundaries.fetch({url: 'data/Political_Wards.geojson'});
          }
          this.show(new CityMapView({ collection: this.wardLeaders }));
     },
     learn: function() {
          var view = new Backbone.Marionette.ItemView({
               template: '#tmpl-learn',
               templateHelpers: { errorLink: errorLink }
          });
          this.show(view);
     },
     static: function(key) {
          if( ! $('#tmpl-' + key).length) key = 'intro';
          this.show(new Backbone.Marionette.ItemView({template: '#tmpl-' + key, className: key}));
     }
});
var router = new Router();
Backbone.history.start();

$(document).foundation();
$(document).foundation('tooltip', 'reflow');
