var Backbone = require('backbone'),
     util = require('../util');

module.exports = Backbone.Model.extend({
     initialize: function() {
          this.set('division', this.get('district'));
          this.set('nameLowerCase', this.get('name').toLowerCase());
          this.set('divisionOrdinal', util.getOrdinal(this.get('division')));
     }
});