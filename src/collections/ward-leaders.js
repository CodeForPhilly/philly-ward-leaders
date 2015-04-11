var Backbone = require('backbone'),
  Tabletop = require('tabletop').Tabletop,
  WardLeader = require('../models/ward-leader');
require('backbone.tabletopSync');

var comparators = {
     ward: 'Ward',
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

var storage = Tabletop.init({
     key: 'https://docs.google.com/spreadsheets/d/1nkkFQUaxcGa0oDPWl1Vr1cknToIq8FxfJ7CILQrFgBM/pubhtml',
     wait: true
});

module.exports = Backbone.Collection.extend({
     model: WardLeader,
     tabletop: {
          instance: storage,
          sheet: 'Democratic'
     },
     sync: Backbone.tabletopSync,
     sortKey: 'voters',
     comparator: comparators.wardNumber,
     comparators: comparators
});
