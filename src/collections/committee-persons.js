var Backbone = require('backbone'),
     CommitteePerson = require('../models/committee-person');

module.exports = Backbone.Collection.extend({
     model: CommitteePerson,
     initialize: function(models, options) {
          if(options.ward) this.ward = options.ward;
          if(options.party) this.party = options.party;
     },
     url: function() {
          var url = 'https://www.opendataphilly.org/api/action/datastore_search',
               params = {
                    resource_id: '71a9be91-f383-44a1-bba1-f837037f9135'
               };
          if(this.ward) params.q = ('00' + this.ward).slice(-2) + '-'; // pad left + '-';
          if(this.party) params.filters = '{"PARTY":"' + this.party + '"}';
          return url + '?' + $.param(params);
     },
     parse: function(response, options) {
          return response.success ? response.result.records : [];
     },
     comparator: 'division'
});