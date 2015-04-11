var Backbone = require('backbone'),
     util = require('../util');

module.exports = Backbone.Model.extend({
     initialize: function() {
          this.set('division', + this.get('PRECINCT').substr(3));
          this.set('nameLowerCase', this.get('NAME').toLowerCase());
          this.set('divisionOrdinal', util.getOrdinal(this.get('division')));
     }
});