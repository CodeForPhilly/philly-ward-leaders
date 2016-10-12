var Backbone = require('backbone'),
     WardLeader = require('../models/ward-leader'),
     moment = require('moment'),
     util = require('../util');

module.exports = Backbone.Model.extend({
     // Gets called on each ward leader model in the collection
     initialize: function() {
          // Convert to numbers
          var self = this,
               attributes = ['Ward', 'Party Registered', 'Total Registered', 'Party Turnout', 'Total Turnout'];
          attributes.forEach(function(attribute) {
               self.set(attribute, parseInt(self.get(attribute), 10));
          });

          // Calculate vacancies
          var divisions = parseInt(this.get('Divisions'), 10),
               committeePeople = parseInt(this.get('Committee People'), 10);
          this.set('vacancies', divisions * 2 - committeePeople);

          this.set('wardOrdinal', util.getOrdinal(this.get('Ward')));

          // Calculate percentages
          this.set('partyRegisteredPercentage', Math.round(this.get('Party Registered') / this.get('Total Registered') * 100));
          this.set('partyTurnoutPercentage', Math.round(this.get('Party Turnout') / this.get('Party Registered') * 100));
          this.set('totalTurnoutPercentage', Math.round(this.get('Total Turnout') / this.get('Total Registered') * 100));

          // Set default photo if no photo provided
          this.set('avatar', this.get('Photo') ? this.get('Photo') : this.get('Gender') === 'F' ? 'img/avatar-female.png' : 'img/avatar-male.png');

          // Set URL slug
          this.set('slug', this.get('Name').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));

          // Last voted time ago
          this.set('lastVotedAgo', moment(new Date(this.get('Last Voted'))).fromNow());
     }
});
