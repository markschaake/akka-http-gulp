var console = require('console');
var http = require('./http');
var angular = require('angular');

var Foo = function(API_URL) {
  this.doIt = function() {
    console.log('gonna do it');
    http.get(API_URL + '/foos').then(function(js) {
      console.log('did it yo', js);
    });

    http.get(API_URL).then(function(js) {
      console.log('did it again yo', js);
    });

    var data = {
      foo: 'fOO',
      bar: 'Bar',
      baz: 150.5
    };

    http.post(API_URL + '/foos', data).then(
      function(js) {
        console.log('posted yo', js);
      },
      function(err) {
        console.error('failed', err);
      }
    );
  };
};

module.exports = angular
  .module('foo', [require('./config')])
  .service('FooService', ['API_URL', Foo]).name;
