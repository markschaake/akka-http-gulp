(function() {
  'use strict';
  var console = require('console');
  var http = require('./http');

  module.exports = {
    doIt: function() {
      console.log('gonna do it');
      http.get('/api/1/foos').then(function(js) {
        console.log('did it yo', js);
      });

      http.get('/api/1').then(function(js) {
        console.log('did it again yo', js);
      });

      var data = {
        foo: 'fOO',
        bar: 'Bar',
        baz: 150.5
      };

      http.post('/api/1/foos', data).then(
        function(js) {
          console.log('posted yo', js);
        },
        function(err) {
          console.error('failed', err);
        }
      );
    }
  };
})();
