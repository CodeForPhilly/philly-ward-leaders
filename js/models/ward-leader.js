var Backbone = require('Backbone'),
     WardLeader = require('../models/ward-leader'),
     moment = require('moment'),
     util = require('../util');

module.exports = Backbone.Model.extend({
     // Gets called on each ward leader model in the collection
     initialize: function() {
          // Convert to numbers
          var self = this,
               attributes = ['Ward', 'Party Registered', 'Total Registered', 'Turnout 2014 General'];
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