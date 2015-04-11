var Backbone = require('backbone');

module.exports = {
     stringContains: function(needle, haystack) {
          return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
     },

     getOrdinal: function(n) {
          var s=["th","st","nd","rd"],
               v=n%100;
          return n+(s[(v-20)%10]||s[v]||s[0]);
     },

     capitalizeFirstLetter: function(str) {
         return str.charAt(0).toUpperCase() + str.slice(1);
     },

     errorLink: function(field) {
          var params = {
               thePage: Backbone.history.getFragment(),
               whatHappened: 'I found a content or data error'
          };
          if(field) params.tellUs = field + ' should be: ';
          return $('#feedback-link').attr('href') + '?' + $.param(params).replace(/\+/g, '%20');
     }
};
