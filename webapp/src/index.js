(function() {
  'use strict';
  var angular = require('angular');
  var console = require('console');
  console.log(require('./navbar'));

  var mod = angular
        .module('main', [
          require('./foo'),
          require('./navbar')
        ])
        .controller('MainController', ['FooService', function(foo) {
          foo.doIt();
        }]);
})();
