var Backbone = require('backbone'),
     CommitteePerson = require('../models/committee-person');

module.exports = Backbone.Collection.extend({
     model: CommitteePerson,
     initialize: function(models, options) {
          if(options.ward) this.ward = options.ward;
          if(options.party) this.party = options.party;
     },
     partyMap: {
       D: 'Democrat',
       R: 'Republican'
     },
     url: function() {
          var url = 'https://data.phila.gov/resource/hezk-qta3.json',
            params = {};
          if(this.ward) params.ward = ('00' + this.ward).slice(-2); // pad left
          if(this.party) params.party = this.partyMap[this.party] || '';
          return url + '?' + $.param(params);
     },
     comparator: function(row) { return +row.get('division'); }
});