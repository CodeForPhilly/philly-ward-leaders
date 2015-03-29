var spreadsheet = 'https://docs.google.com/spreadsheets/d/1nkkFQUaxcGa0oDPWl1Vr1cknToIq8FxfJ7CILQrFgBM/pubhtml',
     storage = Tabletop.init( { key: spreadsheet, wait: true } );
_.templateSettings.variable = 'data';
     
var layout = new Marionette.LayoutView({
     el: 'body',
     regions: {
          'top-leaders': '#top-leaders',
          'details': '#details'
     }
});

var WardLeader = Backbone.Model.extend({
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
          
          // Set default photo if no photo provided
          this.set('avatar', this.get('Photo') ? this.get('Photo') : this.get('Gender') === 'F' ? 'img/avatar-female.png' : 'img/avatar-male.png');
     }
});

var comparators = {
     voters: function(item) {
          return -item.get('Total Registered');
     },
     turnout: function(item) {
          return -item.get('Turnout 2014 General');
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
     comparator: comparators.voters
});

var TopLeadersItemView = Backbone.Marionette.ItemView.extend({
     template: '#tmpl-top-leaders-item',
     initialize: function() {
          _.bindAll(this, 'onDetails');
     },
     events: {
          'click [data-ward]': 'onDetails'
     },
     onDetails: function(e) {
          console.log(this.model);
          var wardLeaderView = new WardLeaderView({ model: this.model });
          layout.getRegion('details').show(wardLeaderView);
          $(window).scrollTop(0);
          e.preventDefault();
     }
});

var TopLeadersView = Backbone.Marionette.CompositeView.extend({
     template: '#tmpl-top-leaders',
     childView: TopLeadersItemView,
     childViewContainer: '#leaders',
     initialize: function() {
          _.bindAll(this, 'onFilter');
     },
     events: {
          'click [data-filter]': 'onFilter'
     },
     onFilter: function(e) {
          // Resort collection
          var filter = $(e.currentTarget).data('filter');
          this.collection.comparator = comparators[filter];
          this.collection.sort();
          
          // Change active button
          var button = this.$('[data-filter="'+filter+'"]');
          button.parent().siblings().children('a').removeClass('active');
          button.addClass('active');
          e.preventDefault();
     }
});

var WardLeaderView = Backbone.Marionette.ItemView.extend({
     template: '#tmpl-details'
});

var getOrdinal = function(n) {
     var s=["th","st","nd","rd"],
          v=n%100;
     return n+(s[(v-20)%10]||s[v]||s[0]);
};

var wardLeaders = new WardLeaders();
wardLeaders.fetch({
     success: function(collection) {
          var topLeadersView = new TopLeadersView({collection: wardLeaders});
          layout.getRegion('top-leaders').show(topLeadersView);
     }
});