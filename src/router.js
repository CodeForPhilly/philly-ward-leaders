var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  NProgress = require('nprogress'),
  util = require('./util'),
  WardLeaders = require('./collections/ward-leaders'),
  CommitteePersons = require('./collections/committee-persons'),
  WardLeaderListView = require('./views/ward-leader-list'),
  WardLeaderDetailsView = require('./views/ward-leader-details'),
  CommitteePersonListView = require('./views/committee-person-list'),
  WardMapView = require('./views/ward-map'),
  CityMapView = require('./views/city-map'),
  Templates = {
    about: require('./templates/about.html'),
    faq: require('./templates/faq.html'),
    learn: require('./templates/learn.html'),
    intro: require('./templates/intro.html'),
    rules: require('./templates/rules.html')
  };

module.exports = Backbone.Router.extend({
  routes: {
    "": "static",
    "list": "list",
    ":ward/:slug": "details",
    "map": "map",
    ":page": "static"
  },
  show: function(view) {
    this.layout.getRegion('main').show(view);
    document.title = view.title !== undefined && view.title && view.title !== 'Intro' ? view.title + ' | ' + this.pageTitle : this.pageTitle;
    $(window).scrollTop(0);
  },
  initialize: function(options) {
    this.layout = options.layout;
    this.pageTitle = $("title").text();
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
    this.show(new WardLeaderListView({ collection: this.wardLeaders }));
  },
  details: function(ward, slug) {
    if(this.wardLeaders.length) {
      var model = this.wardLeaders.findWhere({Ward: +ward, slug: slug});
      this.show(new WardLeaderDetailsView({ model: model, divisionBoundaries: this.divisionBoundaries }));
    } else {
      var self = this;
      this.wardLeaders.on('sync', function() {
        var model = self.wardLeaders.findWhere({Ward: +ward, slug: slug});
        self.show(new WardLeaderDetailsView({ model: model, divisionBoundaries: self.divisionBoundaries }));
      });
    }
  },
  map: function() {
    if( ! this.wardBoundaries) {
      this.wardBoundaries = new Backbone.Model();
      this.wardBoundaries.fetch({url: 'data/Political_Wards.geojson'});
    }
    this.show(new CityMapView({ collection: this.wardLeaders, wardBoundaries: this.wardBoundaries }));
  },
  static: function(key) {
    var template = Templates[key];
    if(template === undefined) {
      template = Templates.intro;
      key = 'intro';
    }
    var view = new Backbone.Marionette.ItemView({
      template: template,
      className: key,
      templateHelpers: { errorLink: util.errorLink }
    });
    view.title = util.capitalizeFirstLetter(key);
    this.show(view);
  }
});
