'use strict';

var Navbar = function(auth) {
  return {
    restrict: 'E',
    template: require('./navbar.html'),
    scope: {},
    link: function(scope) {
      scope.name = "Foo Ya Boyee!!!";
      scope.auth = auth;
    }
  };
};

module.exports = ['AuthService', Navbar];
